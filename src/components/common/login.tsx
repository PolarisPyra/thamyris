import React, { useRef, useState } from "react";

import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import Spinner from "@/components/common/spinner";
import { useAuth } from "@/hooks/auth";
import { turnstile } from "@/lib/constants";

export const LoginContent = () => {
	const { login, isLoading } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [canSubmit, setCanSubmit] = useState(false);
	const refTurnstile = useRef<TurnstileInstance>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			refTurnstile.current?.reset();
			await login(username, password);
		} catch (err: any) {
			toast.error(err);
		}
	};

	return (
		<div className="bg-card mx-4 w-full max-w-md rounded-md p-8">
			<h1 className="text-primary mb-8 text-center text-4xl font-bold">Welcome Back</h1>
			<form className="space-y-6" onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username" className="text-primary block text-sm font-medium">
						Username
					</label>
					<input
						type="text"
						id="username"
						className="text-primary border-border mt-1 block w-full rounded-md border px-4 py-3 transition duration-300 focus:border-blue-500 focus:ring-blue-500"
						placeholder="Username"
						autoComplete="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						disabled={isLoading}
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
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={isLoading}
					/>
				</div>
				<Turnstile id="turnstile-1" ref={refTurnstile} siteKey={turnstile} onSuccess={() => setCanSubmit(true)} />
				<button
					disabled={!canSubmit}
					className="text-buttontext hover:bg-buttonhover bg-button mb-4 flex w-full transform justify-center rounded-md px-6 py-3 font-semibold transition duration-300 hover:scale-105 hover:cursor-pointer"
				>
					{isLoading ? <Spinner size={24} color="#ffffff" /> : "Login"}
				</button>
				<Link to="/">
					<button className="text-buttontext hover:bg-buttonhover bg-button w-full transform rounded-md px-6 py-3 font-semibold transition duration-300 hover:scale-105 hover:cursor-pointer">
						Back
					</button>
				</Link>
			</form>
		</div>
	);
};
