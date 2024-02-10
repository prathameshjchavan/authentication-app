"use server";

import { Session } from "next-auth/types";

import { update  } from "@/auth";

export const updateServerSession = async (session: Session) => {
	await update(session);
};
