import React, { useState } from "react";

import { toast } from "sonner";

import { useAuth } from "@/hooks/auth";
import { useUpdateAimecard } from "@/hooks/users";

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
		<div className="bg-card rounded-md p-6">
			<h2 className="text-primary mb-2 text-xl font-semibold">Aime Card Settings</h2>
			<div className="text-primary mb-4 text-sm">
				Changes the in-game aime card (affects the aime.txt for artemis games dont forget to update it)
			</div>

			<div className="text-primary mb-2 text-sm">Current Aime Card: {user?.aimeCardId || "Not set"}</div>
			<form onSubmit={handleUpdateAimecard} className="space-y-4">
				<div>
					<label htmlFor="accessCode" className="text-primary mb-1 block text-sm font-medium">
						Access Code ({accessCode.length}/20 digits)
					</label>
					<input
						type="text"
						id="accessCode"
						value={accessCode}
						onChange={handleInputChange}
						className="bg-textbox text-primary w-full p-2"
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
					className="bg-button hover:bg-buttonhover text-buttontext mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg p-3 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-80"
				>
					{updateAimecard.isPending ? "Updating..." : "Update aime card"}
				</button>
			</form>
		</div>
	);
};

export default AimeCardSwap;
