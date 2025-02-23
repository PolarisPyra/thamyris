import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-provider";
import Spinner from "@/components/common/spinner";

const WelcomePage = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		navigate("/overview");
	}

	if (isAuthenticated === null) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
				<Spinner size={40} color="#3b82f6" />
			</div>
		);
	}
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4 z-10">
			<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
				<h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome</h1>
				<div className="space-y-6">
					<a href="/login" className="w-full block">
						<button className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-300 transform hover:scale-105">
							Login
						</button>
					</a>
					<a href="/signup" className="w-full block">
						<button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105">
							Sign up
						</button>
					</a>
				</div>
				<p className="text-center text-gray-500 mt-6 text-sm">Join our community today!</p>
			</div>
		</div>
	);
};

export default WelcomePage;
