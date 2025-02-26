import React from "react";

import { useNavigate } from "react-router-dom";

import Spinner from "@/components/common/spinner";
import { useAuth } from "@/context/auth-provider";

const WelcomePage = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		navigate("/overview");
	}

	if (isAuthenticated === null) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
				<Spinner size={40} color="#3b82f6" />
			</div>
		);
	}
	return (
		<div className="z-10 flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
			<div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
				<h1 className="mb-8 text-center text-4xl font-bold text-gray-800">Welcome</h1>
				<div className="space-y-6">
					<a href="/login" className="block w-full">
						<button className="w-full transform rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition duration-300 hover:scale-105 hover:bg-gray-50">
							Login
						</button>
					</a>
					<a href="/signup" className="block w-full">
						<button className="w-full transform rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 hover:scale-105 hover:bg-blue-700">
							Sign up
						</button>
					</a>
				</div>
				<p className="mt-6 text-center text-sm text-gray-500">Join our community today!</p>
			</div>
		</div>
	);
};

export default WelcomePage;
