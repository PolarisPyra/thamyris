import { useAuth } from "@/context/auth-provider";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated === null) {
		return <div>Loading...</div>;
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
