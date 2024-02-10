import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { Fragment, ReactNode } from "react";
import FormError from "../form-error";

interface RoleGateProps {
	children: ReactNode;
	allowedRole: UserRole;
}

const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
	const role = useCurrentRole();

	if (role !== allowedRole) {
		return (
			<FormError message="You do not have permission to view this content!" />
		);
	}

	return <Fragment>{children}</Fragment>;
};

export default RoleGate;
