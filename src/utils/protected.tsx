import React from "react";

import { Navigate, Outlet } from "react-router-dom";

import Spinner from "@/components/common/spinner";
import { useAuth } from "@/hooks/auth";

export const ProtectedRoute = () => {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
				<Spinner size={40} color="#3b82f6" />
			</div>
		);
	}

	return user ? <Outlet /> : <Navigate to="/" replace />;
};
