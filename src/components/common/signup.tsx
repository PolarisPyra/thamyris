import React, { useState } from "react";

import { Link } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/hooks/auth/use-auth";

const SignUpContent = () => {
	const { signup, isLoading } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [accessCode, setAccessCode] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await signup(username, password, accessCode);
		} catch (err: any) {
			toast.error(err);
		}
	};

	return (
		<div className="bg-card mx-4 w-full max-w-md rounded-md p-8">
			<h1 className="text-primary mb-8 text-center text-4xl font-bold">Create Account</h1>
			<form className="space-y-6" onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username" className="text-primary block text-sm font-medium">
						Username
					</label>
					<input
						type="username"
						id="username"
						className="text-primary border-border mt-1 block w-full rounded-md border px-4 py-3 transition duration-300 focus:border-blue-500 focus:ring-blue-500"
						placeholder="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="password" className="text-primary block text-sm font-medium">
						Password
					</label>
					<input
						type="password"
						id="password"
						className="text-primary border-border mt-1 block w-full rounded-md border px-4 py-3 transition duration-300 focus:border-blue-500 focus:ring-blue-500"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="accessCode" className="text-primary block text-sm font-medium">
						Access Code
					</label>
					<input
						type="text"
						id="accessCode"
						className="text-primary border-border focus:ring-trans mt-1 block w-full rounded-md border px-4 py-3 transition duration-300 focus:border-blue-500"
						placeholder="Enter your access code"
						value={accessCode}
						onChange={(e) => setAccessCode(e.target.value)}
					/>
				</div>

				<button
					type="submit"
					className="bg-button text-primary hover:bg-buttonhover block w-full transform cursor-pointer rounded-lg px-6 py-3 text-center font-semibold transition duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isLoading ? "Creating Account..." : "Create Account"}
				</button>
			</form>
			<p className="text-primary mt-6 text-center text-sm">
				Already have an account?{" "}
				<Link to="/login" className="text-blue-600 hover:text-blue-500">
					Log in
				</Link>
			</p>
		</div>
	);
};

export default SignUpContent;
