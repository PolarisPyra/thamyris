import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import React from "react";

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
		<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-gray-700">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-100">Rivals {rivalCount}/4</h2>
				<div className="relative w-full sm:w-auto">
					<input
						type="text"
						placeholder="Search rivals..."
						className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
						value={searchQuery}
						onChange={onSearchChange}
					/>
					<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
				</div>
			</div>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="text-gray-400">Username</TableHead>
							<TableHead className="text-gray-400">Rival Status</TableHead>
							<TableHead className="text-gray-400">Mutual Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rivals.map((rival) => (
							<TableRow key={rival.id} className="hover:bg-gray-700 border-b border-gray-700">
								<TableCell className="text-sm text-gray-300">{rival.username}</TableCell>
								<TableCell className="text-sm text-gray-300">{rival.rivalIcon}</TableCell>
								<TableCell className="text-sm text-gray-300">{rival.mutualIcon}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default RivalsTable;
