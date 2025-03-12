import React from "react";

import { Search } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RivalsTableProps {
	rivals: {
		id: number;
		username: string;
		rivalIcon?: React.ReactNode;
		mutualIcon?: React.ReactNode;
		isMutual?: boolean;
	}[];
	searchQuery: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	rivalCount: number;
}

const RivalsTable = ({ rivals, searchQuery, onSearchChange, rivalCount }: RivalsTableProps) => {
	return (
		<div className="bg-card rounded-md p-4 sm:p-6">
			<div className="mb-4 flex flex-col items-center justify-between gap-4 sm:mb-6 sm:flex-row">
				<h2 className="text-primary text-lg font-semibold sm:text-xl">Rivals {rivalCount}/4</h2>
				<div className="relative w-full sm:w-auto">
					<input
						type="text"
						placeholder="Search rivals..."
						className="bg-searchbar text-primary placeholder-primary focus:ring-primary w-full rounded-lg py-2 pr-4 pl-10 focus:ring-0 focus:outline-none"
						value={searchQuery}
						onChange={onSearchChange}
					/>
					<Search className="text-primary absolute top-2.5 left-3" size={18} />
				</div>
			</div>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="border-seperator border-b hover:bg-transparent">
							<TableHead className="text-primary">Username</TableHead>
							<TableHead className="text-primary">Rival Status</TableHead>
							<TableHead className="text-primary">Mutual Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rivals.map((rival) => (
							<TableRow key={rival.id} className="border-seperator hover:bg-hover border-b">
								<TableCell className="text-primary text-sm">{rival.username}</TableCell>
								<TableCell className="text-primary text-sm">{rival.rivalIcon}</TableCell>
								<TableCell className="text-primary text-sm">{rival.mutualIcon}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default RivalsTable;
