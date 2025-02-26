import React from "react";

import { Search } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ScoreTableProps {
  scores: {
    id: number;
    title: string | React.ReactNode;
    score: string;
    grade: string;
    date: string;
    level: string | React.ReactNode;
    difficulty: string;
    lamp: string;
    combolamp: string;
    rating: string | React.ReactNode;
  }[];
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ScoreTable = ({ scores, searchQuery, onSearchChange }: ScoreTableProps) => {
  return (
    <div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg backdrop-blur-md sm:p-6">
      <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:mb-6 sm:flex-row">
        <h2 className="text-lg font-semibold text-gray-100 sm:text-xl">Scores</h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search songs..."
            className="w-full rounded-lg bg-gray-700 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={onSearchChange}
          />
          <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-gray-400">Song</TableHead>
              <TableHead className="text-gray-400">Score</TableHead>
              <TableHead className="text-gray-400">Rating</TableHead>
              <TableHead className="text-gray-400">Grade</TableHead>
              <TableHead className="text-gray-400">Playdate</TableHead>
              <TableHead className="text-gray-400">Level</TableHead>
              <TableHead className="text-gray-400">Combo Lamp</TableHead>
              <TableHead className="text-gray-400">Clear lamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score) => (
              <TableRow key={score.id} className="border-b border-gray-700 hover:bg-gray-700">
                <TableCell className="max-w-[140px] truncate text-sm text-gray-300">{score.title}</TableCell>
                <TableCell className="text-sm text-gray-300">{score.score}</TableCell>
                <TableCell className="text-sm text-gray-300">{score.rating}</TableCell>
                <TableCell className="text-sm text-gray-300">{score.grade}</TableCell>
                <TableCell className="text-sm text-gray-300">{score.date}</TableCell>
                <TableCell className="text-sm text-gray-300">{score.level}</TableCell>
                <TableCell className="text-sm text-gray-300">{score.combolamp}</TableCell>
                <TableCell className="text-sm text-gray-300">{score.lamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ScoreTable;
