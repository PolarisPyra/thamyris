import { useAuth } from "@/context/auth-provider";
import React, { useState } from "react";

export const LoginPage: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login, isLoading } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		try {
			await login(username, password);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4 z-10">
			<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
				<h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome Back</h1>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="username" className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="text"
							id="username"
							className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
							placeholder="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
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
						/>
					</div>
					{error && <div className="text-red-500 text-sm text-center">{error}</div>}
					<button
						type="submit"
						disabled={isLoading}
						className={`w-full block text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 ${
							isLoading ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						{isLoading ? "Logging in..." : "Login"}
					</button>
				</form>
				<p className="text-center text-gray-500 mt-6 text-sm">
					Don't have an account?{" "}
					<a href="/signup" className="text-blue-600 hover:text-blue-500">
						Sign up
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
