import React, { useState } from "react";

import { Link } from "react-router-dom";
import { toast } from "sonner";

import Spinner from "@/components/common/spinner";
import { useAuth } from "@/hooks/auth/use-auth";

export const LoginContent = () => {
	const { login, isLoading } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(username, password);
		} catch (err: any) {
			toast.error(err);
		}
	};

	return (
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
						autoComplete="username"
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
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button
					type="submit"
					className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isLoading ? <Spinner size={24} color="#ffffff" /> : "Login"}
				</button>
				<Link to="/">
					<button className="w-full transform rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition duration-300 hover:scale-105 hover:bg-gray-50">
						Back
					</button>
				</Link>
			</form>
		</div>
	);
};
