import React from "react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
	return (
		<div className="mt-6 mb-8 flex items-center justify-center space-x-4">
			<button
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
				className="text-buttontext bg-button hover:bg-buttonhover cursor-pointer rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
			>
				Previous
			</button>
			<span className="text-primary text-sm">
				Page {currentPage} of {totalPages}
			</span>
			<button
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(currentPage + 1)}
				className="text-buttontext bg-button hover:bg-buttonhover cursor-pointer rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
			>
				Next
			</button>
		</div>
	);
};

export default Pagination;
