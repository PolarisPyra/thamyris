import React from "react";

export const NotFound = () => {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8 text-center">
			<h1 className="mb-4 text-6xl font-bold text-gray-800 md:text-8xl">404</h1>
			<p className="mb-8 max-w-md text-lg text-gray-600 md:text-xl">Oops! The page you are looking for does not exist.</p>
			<a
				href="/"
				className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Go back to Home
			</a>
		</div>
	);
};
