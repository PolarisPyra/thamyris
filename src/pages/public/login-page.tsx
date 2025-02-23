import { useAuth } from "@/context/auth-provider";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "@/components/common/spinner";

export const LoginPage: React.FC = () => {
	const { login, isLoading, error, isAuthenticated } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [localError, setLocalError] = useState("");

	if (isAuthenticated) {
		return <Navigate to="/overview" replace />;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLocalError("");
		try {
			await login(username, password);
		} catch (err) {
			setLocalError(err instanceof Error ? err.message : "Login failed");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4 z-10">
			<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
				<h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome Back</h1>
				<form className="space-y-6" onSubmit={handleSubmit}>
					{(error || localError) && (
						<div className="text-red-500 text-sm text-center">{error || localError}</div>
					)}
					<div>
						<label htmlFor="username" className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="text"
							id="username"
							className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
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
							className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading}
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isLoading}
					>
						{isLoading ? <Spinner size={24} color="#ffffff" /> : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};
