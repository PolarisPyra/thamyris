import React, { useState } from "react";

import { toast } from "sonner";

import { useAuth } from "@/hooks/auth/use-auth";
import { useUpdateAimecard } from "@/hooks/users/use-update-aimecard";

const AimeCardSwap = () => {
	const [accessCode, setAccessCode] = useState("");
	const updateAimecard = useUpdateAimecard();
	const { user } = useAuth();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (/^\d{0,20}$/.test(value)) {
			setAccessCode(value);
		}
	};

	const handleUpdateAimecard = async (e: React.FormEvent) => {
		e.preventDefault();
		if (accessCode.length !== 20) {
			toast.error("Access code must be 20 digits");
			return;
		}
		try {
			await updateAimecard.mutateAsync(accessCode);
			toast.success("Aime card updated successfully! Don't forget to relog to see the changes.");
			setAccessCode("");
		} catch (error) {
			console.error("Failed to update aime card:", error);
			toast.error("Failed to update aime card");
		}
	};

	return (
		<div className="rounded-lg bg-gray-800 p-6 shadow-md">
			<h2 className="mb-2 text-xl font-semibold">Aime Card Settings</h2>
			<div className="mb-4 text-sm text-gray-400">
				Changes the in-game aime card (affects the aime.txt for artemis games dont forget to update it)
			</div>

			<div className="mb-2 text-sm text-gray-400">Current Aime Card: {user?.aimeCardId || "Not set"}</div>
			<form onSubmit={handleUpdateAimecard} className="space-y-4">
				<div>
					<label htmlFor="accessCode" className="mb-1 block text-sm font-medium">
						Access Code ({accessCode.length}/20 digits)
					</label>
					<input
						type="text"
						id="accessCode"
						value={accessCode}
						onChange={handleInputChange}
						className="w-full rounded border border-gray-600 bg-gray-700 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
						placeholder="Enter 20-digit access code"
						required
						pattern="\d{20}"
						maxLength={20}
						inputMode="numeric"
					/>
				</div>

				<button
					type="submit"
					disabled={updateAimecard.isPending || accessCode.length !== 20}
					className="w-full rounded bg-blue-600 p-2 transition-colors hover:bg-blue-700 disabled:opacity-50"
				>
					{updateAimecard.isPending ? "Updating..." : "Update Aime Card"}
				</button>
			</form>
		</div>
	);
};

export default AimeCardSwap;
