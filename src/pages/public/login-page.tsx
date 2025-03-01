import React, { useState } from "react";

import { Navigate } from "react-router-dom";

import Spinner from "@/components/common/spinner";
import { useAuth } from "@/hooks/auth/use-auth";

export const LoginPage: React.FC = () => {
	const { login, isLoading, isAuthenticated } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	if (isAuthenticated) {
		return <Navigate to="/overview" replace />;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(username, password);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="z-10 flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
			<div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
				<h1 className="mb-8 text-center text-4xl font-bold text-gray-800">Welcome Back</h1>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="username" className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="text"
							id="username"
							className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 transition duration-300 focus:border-blue-500 focus:ring-blue-500"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							disabled={isLoading}
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							id="password"
							className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 transition duration-300 focus:border-blue-500 focus:ring-blue-500"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading}
						/>
					</div>
					<button
						type="submit"
						className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isLoading}
					>
						{isLoading ? <Spinner size={24} color="#ffffff" /> : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};
