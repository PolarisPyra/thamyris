import React, { useState } from "react";

import { useAuth } from "@/hooks/auth/use-auth";

const SignUpPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [accessCode, setAccessCode] = useState("");
	const { signup, isLoading, error } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await signup(username, password, accessCode);
	};

	return (
		<div className="z-10 flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
			<div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
				<h1 className="mb-8 text-center text-4xl font-bold text-gray-800">Create Account</h1>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="username" className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="username"
							id="username"
							className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 transition duration-300 focus:border-blue-500 focus:ring-blue-500"
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
							className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 transition duration-300 focus:border-blue-500 focus:ring-blue-500"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<div>
						<label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
							Access Code
						</label>
						<input
							type="text"
							id="accessCode"
							className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 transition duration-300 focus:border-blue-500 focus:ring-blue-500"
							placeholder="Enter your access code"
							value={accessCode}
							onChange={(e) => setAccessCode(e.target.value)}
						/>
					</div>

					{error && <div className="text-center text-sm text-red-500">{error}</div>}

					<button
						type="submit"
						disabled={isLoading}
						className="block w-full transform rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition duration-300 hover:scale-105 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading ? "Creating Account..." : "Create Account"}
					</button>
				</form>
				<p className="mt-6 text-center text-sm text-gray-500">
					Already have an account?{" "}
					<a href="/" className="text-blue-600 hover:text-blue-500">
						Log in
					</a>
				</p>
			</div>
		</div>
	);
};

export default SignUpPage;
