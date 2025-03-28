import { useState } from "react";
import React from "react";

import { Handshake, Skull } from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/common/header";
import Pagination from "@/components/common/pagination";
import RivalsTable from "@/components/common/rivals-table";
import Spinner from "@/components/common/spinner";
import {
	useAddRival,
	useChunithmVersion,
	useRemoveRival,
	useRivalCount,
	useRivalUsers,
	useRivals,
} from "@/hooks/chunithm";

const ITEMS_PER_PAGE = 10;

const ChunithmRivals = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const version = useChunithmVersion();
	const { data: rivalIds = [], isLoading: isLoadingRivals } = useRivals();
	const { data: rivalCount = 0, isLoading: isLoadingCount } = useRivalCount();
	const { data: users = [], isLoading: isLoadingUsers } = useRivalUsers();
	const { mutate: addRival } = useAddRival();
	const { mutate: removeRival } = useRemoveRival();

	const filteredRivals = users.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()));

	const totalPages = Math.ceil(filteredRivals.length / ITEMS_PER_PAGE);
	const paginatedRivals = filteredRivals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	const handleAddRival = (id: number) => {
		if (rivalCount >= 3) {
			toast.error("You can only have up to 3 rivals.");
			return;
		}

		addRival(id, {
			onSuccess: () => {
				toast.success("Rival added successfully!");
			},
			onError: () => {
				toast.error("Failed to add rival");
			},
		});
	};

	const handleRemoveRival = (id: number) => {
		removeRival(id, {
			onSuccess: () => {
				toast.success("Rival removed successfully!");
			},
			onError: () => {
				toast.error("Failed to remove rival");
			},
		});
	};

	const isLoading = isLoadingRivals || isLoadingCount || isLoadingUsers;

	if (isLoading) {
		return (
			<div className="relative flex-1 overflow-auto">
				<Header title="Rivals" />
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<div className="text-primary text-lg">
						<Spinner size={24} color="#ffffff" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={`Rivals ${rivalCount}/3`} />
			{version ? (
				<div className="container mx-auto space-y-6">
					<div className="mb-4 space-y-8 p-4 sm:px-6 sm:py-0">
						<RivalsTable
							rivals={paginatedRivals.map((user) => ({
								id: user.id,
								username: user.username,
								mutualIcon: user.isMutual ? <Handshake className="h-8 w-8 text-green-500" /> : null,
								rivalIcon: (
									<Skull
										className={`h-8 w-8 ${rivalIds.includes(user.id) ? "text-red-500" : "text-primary`"}`}
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

						{totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
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

export default ChunithmRivals;
