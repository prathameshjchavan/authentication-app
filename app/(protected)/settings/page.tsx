"use client";

import { useSession } from "next-auth/react";

import { logout } from "@/actions/logout";

const SettingsPage = () => {
	const session = useSession();

	const onClick = () => {
		logout();
	};

	return (
		<div>
			<p>{JSON.stringify(session)}</p>
			<button onClick={onClick} type="submit">
				Sign Out
			</button>
		</div>
	);
};

export default SettingsPage;
