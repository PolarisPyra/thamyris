import React, { ReactNode, useCallback } from "react";

import { Link, Outlet } from "react-router-dom";

export const WelcomeContent = () => (
	<div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
		<h1 className="mb-8 text-center text-4xl font-bold text-gray-800">Welcome</h1>
		<div className="space-y-6">
			<Link to="/login">
				<button className="w-full transform rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition duration-300 hover:scale-105 hover:bg-gray-50">
					Login
				</button>
			</Link>
			<Link to="/signup">
				<button className="w-full transform rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 hover:scale-105 hover:bg-blue-700">
					Sign up
				</button>
			</Link>
		</div>
		<p className="mt-6 text-center text-sm text-gray-500">Join our community today!</p>
	</div>
);

const WelcomePage = () => {
	const welcomeContainer = useCallback((child: ReactNode) => {
		return (
			<div className="z-10 flex min-h-screen items-center justify-center from-blue-50 to-purple-100 p-4">{child}</div>
		);
	}, []);
	return welcomeContainer(<Outlet />);
};

export default WelcomePage;
