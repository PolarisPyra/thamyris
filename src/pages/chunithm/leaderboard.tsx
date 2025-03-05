import { useState } from "react";
import React from "react";

import Header from "@/components/common/header";
import { LeaderboardTable } from "@/components/common/leaderboard-table";
import Pagination from "@/components/common/pagination";
import Spinner from "@/components/common/spinner";
import { useLeaderboard } from "@/hooks/chunithm/use-leaderboard";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";

const ITEMS_PER_PAGE = 50;

const ChunithmLeaderboard = () => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const { data: leaderboard = [], isLoading } = useLeaderboard();
	const { data: version } = useChunithmVersion();

	const filteredData = leaderboard.filter((player) => player.username.toLowerCase().includes(search.toLowerCase()));

	const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
	const currentData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

	if (isLoading) {
		return (
			<div className="relative flex-1 overflow-auto">
				<Header title="Leaderboard" />
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<Spinner size={24} />
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Leaderboard" />
			{version ? (
				<div className="container mx-auto p-4">
					<LeaderboardTable
						players={currentData}
						searchQuery={search}
						onSearchChange={(e) => setSearch(e.target.value)}
						page={page}
						itemsPerPage={ITEMS_PER_PAGE}
					/>

					{totalPages > 1 && (
						<div className="mt-4 flex justify-center">
							<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
						</div>
					)}
				</div>
			) : (
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<p className="text-gray-400">Please set your Chunithm version in settings first</p>
				</div>
			)}
		</div>
	);
};

export default ChunithmLeaderboard;
