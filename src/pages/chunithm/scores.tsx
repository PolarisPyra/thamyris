import { useState } from "react";
import React from "react";

import ChunithmScoreTable from "@/components/chunithm/score-table";
import Header from "@/components/common/header";
import Spinner from "@/components/common/spinner";
import { useChunithmScores } from "@/hooks/chunithm/use-scores";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";

const ChunithmScorePage = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const { data: scores = [], isLoading: isLoadingScores } = useChunithmScores();
	const { data: version } = useChunithmVersion();

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
					<div className="mb-4 space-y-8 p-4 sm:p-0">
						<ChunithmScoreTable
							scores={scores}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
			) : (
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<p className="text-primary">Please set your Chunithm version in settings first</p>
				</div>
			)}
		</div>
	);
};

export default ChunithmScorePage;
