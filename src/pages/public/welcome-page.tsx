import React from "react";

import { Link, Navigate, Outlet } from "react-router-dom";

import BgGame from "@/components/bgGame/bgGame";
import { useAuth } from "@/hooks/auth/use-auth";

export const WelcomeContent = () => (
	<div className="bg-card mx-4 w-full max-w-md rounded-md p-8">
		<h1 className="text-primary mb-8 text-center text-4xl font-bold">Welcome</h1>
		<div className="space-y-6">
			<Link to="/login">
				<button className="text-buttontext hover:bg-buttonhover bg-button mb-4 w-full transform rounded-md px-6 py-3 font-semibold transition duration-300 hover:scale-105 hover:cursor-pointer">
					Login
				</button>
			</Link>
			<Link to="/signup">
				<button className="text-buttontext hover:bg-buttonhover bg-button w-full transform rounded-md px-6 py-3 font-semibold transition duration-300 hover:scale-105 hover:cursor-pointer">
					Sign up
				</button>
			</Link>
		</div>
		<p className="text-primary mt-6 text-center text-sm">Join our community today!</p>
	</div>
);

const WelcomePage = () => {
	const { user } = useAuth();

	return user ? (
		<Navigate to="/overview" />
	) : (
		<>
			<BgGame />
			<div className="bg-background z-10 flex min-h-screen items-center justify-center p-4">
				<Outlet />
			</div>
		</>
	);
};

export default WelcomePage;
