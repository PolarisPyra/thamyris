import { useState } from "react";
import React from "react";

import Header from "@/components/common/header";
import Pagination from "@/components/common/pagination";
import Spinner from "@/components/common/spinner";
import OngekiScoreTable from "@/components/ongeki/score-table";
import OngekiScoreTableNew from "@/components/ongeki/score-table-new";
import { useOngekiScores, useOngekiVersion } from "@/hooks/ongeki";

const OngekiScorePage = () => {
	const version = useOngekiVersion();
	const isRefreshOrAbove = Number(version) >= 8;

	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const { data: scores = [], isLoading: isLoadingScores } = useOngekiScores();

	const filteredByVersionScores = isRefreshOrAbove
		? scores.filter((score) => {
				const rating = Math.abs(score.playerRating ?? 0).toString();
				return rating.length === 5; // Show only 5-digit ratings (like 14375) for version 8+
			})
		: scores.filter((score) => {
				const rating = Math.abs(score.playerRating ?? 0).toString();
				return rating.length === 4; // Show only 4-digit ratings (like 1438) for versions below 8
			});

	const filteredScores = filteredByVersionScores.filter((score) =>
		score.title?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const itemsPerPage = 15;
	const totalPages = Math.ceil(filteredScores.length / itemsPerPage);

	const paginatedScores = filteredScores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	if (isLoadingScores) {
		return (
			<div className="relative flex-1 overflow-auto">
				<Header title="Overview" />
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<div className="text-lg text-gray-400">
						<Spinner size={24} color="#ffffff" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Scores" />
			{version ? (
				<div className="container mx-auto space-y-6">
					<div className="mb-4 space-y-8 p-4 sm:px-6 sm:py-0">
						{isRefreshOrAbove ? (
							<OngekiScoreTableNew
								scores={paginatedScores}
								searchQuery={searchQuery}
								onSearchChange={(e) => setSearchQuery(e.target.value)}
							/>
						) : (
							<OngekiScoreTable
								scores={paginatedScores}
								searchQuery={searchQuery}
								onSearchChange={(e) => setSearchQuery(e.target.value)}
							/>
						)}
						{totalPages > 1 && (
							<div className="mt-4 flex justify-center">
								<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<p className="text-primary">Please set your Ongeki version in settings first</p>
				</div>
			)}
		</div>
	);
};

export default OngekiScorePage;
