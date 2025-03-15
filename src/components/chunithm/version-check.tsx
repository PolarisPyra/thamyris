import React from "react";

import { Navigate, Outlet } from "react-router-dom";

import { useChunithmVersion } from "@/hooks/chunithm";

export const VersionCheck = () => {
	const { data: version } = useChunithmVersion();

	if (version && version < 17) {
		return <Navigate to="/overview" replace />;
	}

	return <Outlet />;
};
