import Header from "@/components/common/header";
import { useState } from "react";
import React from "react";
import { Handshake, Skull, Trophy } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";
import RivalsTable from "@/components/common/rivals-table";
import { toast } from "sonner";
import {
	useRivals,
	useRivalCount,
	useRivalUsers,
	useAddRival,
	useRemoveRival,
} from "@/hooks/chunithm/use-rivals";
import Spinner from "@/components/common/spinner";
import { useUsername } from "@/hooks/common/use-username";
const ITEMS_PER_PAGE = 10;

const ChunithmRivals = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const { data: rivalIds = [], isLoading: isLoadingRivals } = useRivals();
	const { data: rivalCount = 0, isLoading: isLoadingCount } = useRivalCount();
	const { data: users = [], isLoading: isLoadingUsers } = useRivalUsers();
	const { mutate: addRival } = useAddRival();
	const { mutate: removeRival } = useRemoveRival();
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();

	const filteredRivals = users.filter((user) =>
		user.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredRivals.length / ITEMS_PER_PAGE);
	const paginatedRivals = filteredRivals.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const handleAddRival = (id: number) => {
		if (rivalCount >= 4) {
			toast.error("You can only have up to 4 rivals.");
			return;
		}

		addRival(id, {
			onSuccess: () => {
				toast.success("Rival added successfully!");
			},
			onError: (error) => {
				toast.error(error instanceof Error ? error.message : "Failed to add rival");
			},
		});
	};

	const handleRemoveRival = (id: number) => {
		removeRival(id, {
			onSuccess: () => {
				toast.success("Rival removed successfully!");
			},
			onError: (error) => {
				toast.error(error instanceof Error ? error.message : "Failed to remove rival");
			},
		});
	};

	const isLoading = isLoadingRivals || isLoadingCount || isLoadingUsers || isLoadingUsername;

	if (isLoading) {
		return (
			<div className="flex-1 overflow-auto relative">
				<Header title="Rivals" />
				<div className="flex justify-center items-center h-[calc(100vh-64px)]">
					<div className="text-lg text-gray-400">
						<Spinner size={24} color="#ffffff" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-auto relative">
			<Header title={`Rivals ${rivalCount}/4`} />
			<main className="max-w-full mx-auto h-[calc(100vh-64px)] py-6 px-4 lg:px-8">
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-1 w-full">
						<QouteCard
							welcomeMessage={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
							tagline={""}
							icon={Trophy}
							color={"#9e0bd9"}
						/>
						<div className="mt-6 space-y-6"></div>
						<RivalsTable
							rivals={paginatedRivals.map((user) => ({
								id: user.id,
								username: user.username,
								mutualIcon: user.isMutual ? <Handshake className="w-8 h-8 text-green-500" /> : null,
								rivalIcon: (
									<Skull
										className={`w-8 h-8 ${rivalIds.includes(user.id) ? "text-red-500" : "text-gray-500"}`}
										onClick={() => {
											const isRival = rivalIds.includes(user.id);
											if (isRival) {
												handleRemoveRival(user.id);
											} else {
												handleAddRival(user.id);
											}
										}}
									/>
								),
							}))}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
							rivalCount={rivalCount}
						/>
					</div>
					<div className="flex justify-center items-center space-x-4 mb-4">
						<button
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((prev) => prev - 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Previous
						</button>
						<span className="text-gray-300 text-sm">
							Page {currentPage} of {totalPages}
						</span>
						<button
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((prev) => prev + 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Next
						</button>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ChunithmRivals;
