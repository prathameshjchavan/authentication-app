"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getUserByEmail } from "@/data/user";
import {
	generateVerificationToken,
	generateTwoFactorToken,
} from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "./../data/two-factor-confirmation";

export const login = async (
	values: z.infer<typeof LoginSchema>,
	callbackUrl: string | null
) => {
	const validatedField = LoginSchema.safeParse(values);

	// Check whether fields are valid
	if (!validatedField.success) {
		return { error: "Invalid fields!" };
	}

	const { email, password, code } = validatedField.data;
	const existingUser = await getUserByEmail(email);

	// Check if email exists for credentials authentication
	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: "Email does not exist!" };
	}

	// Send verification email for onboarding users
	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(
			existingUser.email
		);

		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token
		);

		return { success: "Confirmation email sent!" };
	}

	const isAuthenticated = await bcrypt.compare(
		values.password,
		existingUser.password
	);

	if (!isAuthenticated) return { error: "Invalid credentials!" };

	// Perform 2FA authentication
	if (existingUser.isTwoFactorEnabled) {
		if (code) {
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

			if (!twoFactorToken) {
				return { error: "Invalid code!" };
			}

			if (twoFactorToken.token !== code) {
				return { error: "Invalid code!" };
			}

			const hasExpired = new Date(twoFactorToken.expires) < new Date();

			if (hasExpired) {
				return { error: "Code expired!" };
			}

			await db.twoFactorToken.delete({
				where: { id: twoFactorToken.id },
			});

			const existingConfirmation = await getTwoFactorConfirmationByUserId(
				existingUser.id
			);

			if (existingConfirmation) {
				await db.twoFactorConfirmation.delete({
					where: { id: existingConfirmation.id },
				});
			}

			await db.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
			});
		} else {
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);
			await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

			return { twoFactor: true };
		}
	}

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
		});

		return { success: "Logged in successfully!" };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials" };
				default:
					return { error: "Something went wrong" };
			}
		}

		throw error;
	}
};
