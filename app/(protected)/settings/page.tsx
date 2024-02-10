"use client";

import { useTransition } from "react";

import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { updateServerSession } from "@/actions/update-server-session";

const SettingsPage = () => {
	const { update } = useSession();
	const [isPending, startTransition] = useTransition();

	const onClick = () => {
		startTransition(() => {
			settings({
				name: "Prathamesh Chavan",
			}).then(async () => {
				const session = await update();
				if (session) await updateServerSession(session);

				toast.success("Name Updated!");
			});
		});
	};

	return (
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-2xl font-semibold text-center">⚙️ Settings</p>
			</CardHeader>
			<CardContent>
				<Button disabled={isPending} onClick={onClick}>
					Update name
				</Button>
			</CardContent>
		</Card>
	);
};

export default SettingsPage;
