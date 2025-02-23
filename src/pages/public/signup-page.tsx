import { useAuth } from "@/context/auth-provider";
import React, { useState } from "react";

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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4 z-10">
			<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
				<h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Create Account</h1>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="username" className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="username"
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

					<div>
						<label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
							Access Code
						</label>
						<input
							type="text"
							id="accessCode"
							className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
							placeholder="Enter your access code"
							value={accessCode}
							onChange={(e) => setAccessCode(e.target.value)}
						/>
					</div>

					{error && <div className="text-red-500 text-sm text-center">{error}</div>}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full block text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? "Creating Account..." : "Create Account"}
					</button>
				</form>
				<p className="text-center text-gray-500 mt-6 text-sm">
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
