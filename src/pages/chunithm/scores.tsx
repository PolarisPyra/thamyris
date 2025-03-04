import { useState } from "react";
import React from "react";

import { Heart } from "lucide-react";

import ChunithmScoreTable from "@/components/chunithm/chunithm-score-table";
import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import Spinner from "@/components/common/spinner";
import { useChunithmScores } from "@/hooks/chunithm/use-scores";
import { useUsername } from "@/hooks/common/use-username";

const ChunithmScorePage = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const { data: scores = [], isLoading: isLoadingScores } = useChunithmScores();
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();

	if (isLoadingScores || isLoadingUsername) {
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
			<div className="container mx-auto space-y-6">
				<div className="gap-4 p-4 py-6 sm:p-0">
					<QouteCard
						tagline=""
						value="View your scores"
						color="#f067e9"
						welcomeMessage={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
						icon={Heart}
					/>
				</div>

				<div className="mb-4 space-y-8 p-4 sm:p-0">
					<ChunithmScoreTable
						scores={scores}
						searchQuery={searchQuery}
						onSearchChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
};

export default ChunithmScorePage;
