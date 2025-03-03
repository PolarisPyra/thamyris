import React from "react";

import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks/auth/use-auth";

export const ProtectedRoute = () => {
	const { user } = useAuth();
	if (!user) {
		return <Navigate to="/login" replace />;
	}
	return <Outlet />;
};
