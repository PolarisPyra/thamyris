import Header from "@/components/common/header";
import { api } from "@/utils";
import { useEffect, useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { Handshake, Skull, Trophy } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";

import RivalsTable from "@/components/common/rivals-table";
import { Toast } from "@/components/common/toast";
interface ChunithmApiResponse {
	results: Rivals[];
}

interface Rivals {
	id: number;
	isMutual: boolean;
	username: string;
	isRival?: boolean;
}

const ITEMS_PER_PAGE = 10;

const ChunithmRivals = () => {
	const [playlogResponse, setResponse] = useState<Rivals[]>([]);
	const [rivalSongIds, setRivalSongIds] = useState<number[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [rivalCount, setRivalCount] = useState(0);
	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "error";
	} | null>(null);

	const filteredRivals = playlogResponse.filter((user) =>
		user.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredRivals.length / ITEMS_PER_PAGE);
	const paginatedRivals = filteredRivals.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const fetchRivals = async () => {
		try {
			const response = await api.chunithm.rivals.all.$get();
			if (response.ok) {
				const data = await response.json();
				setRivalSongIds(data.results);
			}
		} catch (error) {
			console.error("Error fetching rivals:", error);
		}
	};

	const fetchRivalCount = async () => {
		try {
			const response = await api.chunithm.rivals.count.$get();
			if (response.ok) {
				const data = await response.json();
				setRivalCount(data.rivalCount);
			}
		} catch (error) {
			console.error("Error fetching rival count:", error);
		}
	};

	const handleAddRival = async (id: number) => {
		try {
			// Check if the user already has 4 rivals
			if (rivalCount >= 4) {
				setToast({ message: "You can only have up to 4 rivals.", type: "error" });
				return;
			}

			const response = await api.chunithm.rivals.add.$post({
				json: { favId: id },
			});

			if (response.ok) {
				setToast({ message: "Rival added successfully!", type: "success" });
				fetchRivalCount(); // Refresh the count
				fetchRivals(); // Refresh the rival list
			} else {
				setToast({ message: "Failed to add rival.", type: "error" });
			}
		} catch (error) {
			setToast({ message: "Error adding rival.", type: "error" });
			console.error("Error adding rival:", error);
		}
	};

	const handleRemoveRival = async (id: number) => {
		try {
			const response = await api.chunithm.rivals.remove.$post({
				json: { favId: id },
			});
			if (response.ok) {
				setToast({ message: "Rival removed successfully!", type: "success" });
				fetchRivalCount(); // Refresh the count
				fetchRivals(); // Refresh the rival list
			} else {
				setToast({ message: "Failed to remove rival.", type: "error" });
			}
		} catch (error) {
			setToast({ message: "Error removing rival.", type: "error" });
			console.error("Error removing rival:", error);
		}
	};

	const fetchusers = async () => {
		try {
			const [usersResp, mutualResp] = await Promise.all([
				api.chunithm.rivals.userlookup.$get(),
				api.chunithm.rivals.mutual.$get(),
			]);

			if (!usersResp.ok || !mutualResp.ok) {
				throw new Error("Failed to fetch data");
			}

			const usersData: ChunithmApiResponse = await usersResp.json();
			const mutualData = await mutualResp.json();

			// Create a set of mutual rival IDs for quick lookup
			const mutualRivals = new Set(
				mutualData.results
					.filter((r: { isMutual: number }) => r.isMutual === 1)
					.map((r: { rivalId: number }) => r.rivalId)
			);

			const chuniScorePlaylog = usersData.results.map((response) => ({
				id: response.id,
				username: response.username,
				isMutual: mutualRivals.has(response.id),
			}));
			setResponse(chuniScorePlaylog);
		} catch (error) {
			console.error("Error fetching scores:", error);
		}
	};

	useEffect(() => {
		fetchusers();
		fetchRivals();
		fetchRivalCount();
	}, []);

	return (
		<div className="flex-1 overflow-auto relative">
			<Header title={`Rivals ${rivalCount}/4`} />
			{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
			<main className="max-w-full mx-auto h-[calc(100vh-64px)] py-6 px-4 lg:px-8">
				<div className="flex flex-col gap-4">
					<motion.div
						className="grid grid-cols-1 w-full"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<QouteCard
							welcomeMessage="Welcome back,"
							name={"PolarisPyra"}
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
										className={`w-8 h-8 ${rivalSongIds.includes(user.id) ? "text-red-500" : "text-gray-500"}`}
										onClick={() => {
											const isRival = rivalSongIds.includes(user.id);
											if (isRival) {
												handleRemoveRival(user.id);
												setRivalSongIds((previousRivals) =>
													previousRivals.filter((rivalId) => rivalId !== user.id)
												);
											} else {
												handleAddRival(user.id);
												setRivalSongIds((previousRivals) => [...previousRivals, user.id]);
											}
										}}
									/>
								),
							}))}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
							rivalCount={rivalCount}
						/>
					</motion.div>
					<div className="flex justify-center items-center space-x-4  mb-4">
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
