import React, { useState } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useLogout } from "@/hooks/use-logout";

const UserAvatar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { logout } = useLogout();

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
			>
				<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
					<User className="w-5 h-5 text-white" />
				</div>
				<ChevronDown
					className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>
			{isOpen && (
				<div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
					<div className="px-2 py-2">
						<button
							onClick={logout}
							className="w-full px-4 py-2.5 text-sm flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all"
						>
							<LogOut className="w-4 h-4" />
							<span>Log out</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserAvatar;
