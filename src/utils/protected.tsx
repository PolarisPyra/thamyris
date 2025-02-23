import { useAuth } from "@/context/auth-provider";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "@/components/common/spinner";

export const ProtectedRoute = () => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
				<Spinner size={40} color="#3b82f6" />
			</div>
		);
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
