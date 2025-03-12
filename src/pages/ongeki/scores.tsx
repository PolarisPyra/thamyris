import { useState } from "react";
import React from "react";

import Header from "@/components/common/header";
import Spinner from "@/components/common/spinner";
import OngekiScoreTable from "@/components/ongeki/score-table";
import { useOngekiScores } from "@/hooks/chunithm/use-scores";
import { useOngekiVersion } from "@/hooks/ongeki/use-version";

const OngekiScorePage = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const { data: version } = useOngekiVersion();

	const { data: scores = [], isLoading: isLoadingScores } = useOngekiScores();

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
						<OngekiScoreTable
							scores={scores}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
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
