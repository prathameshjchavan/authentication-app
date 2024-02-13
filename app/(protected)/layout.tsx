import { ReactNode } from "react";

import Navbar from "./_components/navbar";

interface ProtectedLayoutProps {
	children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
	return (
		<div className="h-full w-full p-[calc(2.5rem-4px)] overflow-y-auto flex flex-col gap-y-10 items-center justify-start bg-gradient">
			<Navbar />
			{children}
		</div>
	);
};

export default ProtectedLayout;
