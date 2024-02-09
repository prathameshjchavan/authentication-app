import { ReactNode } from "react";

import { logout } from "@/actions/logout";

interface LogoutButtonProps {
	children?: ReactNode;
}

const LogoutButton = ({ children }: LogoutButtonProps) => {
	const onClick = () => {
		logout();
	};

	return (
		<span onClick={onClick} className="cursor-pointer">
			{children}
		</span>
	);
};

export default LogoutButton;
