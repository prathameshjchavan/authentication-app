import { ReactNode } from "react";

const LayoutPage = ({ children }: { children: ReactNode }) => {
	return <div className="h-full flex items-center justify-center bg-gradient">{children}</div>;
};

export default LayoutPage;
