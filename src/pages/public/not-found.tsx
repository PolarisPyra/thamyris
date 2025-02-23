import React from "react";

export const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8 text-center">
			<h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">404</h1>
			<p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md">
				Oops! The page you are looking for does not exist.
			</p>
			<a
				href="/"
				className="px-6 py-3 bg-blue-600 text-white rounded-lg transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Go back to Home
			</a>
		</div>
	);
};
