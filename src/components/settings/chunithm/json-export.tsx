import React from "react";

import { toast } from "sonner";

import { useKamaitachiExport } from "@/hooks/chunithm/use-kamatachi";
import { useReiwaExport } from "@/hooks/chunithm/use-reiwa";

import { SubmitButton } from "../../common/button";

const JsonExport = () => {
	const { data: exportData, isLoading } = useReiwaExport();
	const { data: kamaitachiData } = useKamaitachiExport();

	const handleExportReiwa = () => {
		if (!exportData) {
			toast.error("No export data available");
			return;
		}

		const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "chunithm_reiwa_export.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		toast.success("Successfully exported B30 data");
	};

	const handleExportKamaitachi = () => {
		if (!kamaitachiData) {
			toast.error("No Kamaitachi data available");
			return;
		}

		const blob = new Blob([JSON.stringify(kamaitachiData, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "chunithm_kamaitachi_export.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		toast.success("Successfully exported Kamaitachi data");
	};

	return (
		<div className="bg-card rounded-md p-4 md:p-6">
			<h2 className="text-primary mb-4 text-xl font-semibold">Export Data</h2>
			<div className="flex gap-4">
				<SubmitButton
					onClick={handleExportReiwa}
					defaultLabel="Export ratings as json (for reiwa.f5.si)"
					updatingLabel="Exporting..."
					disabled={isLoading}
				/>
				<SubmitButton
					onClick={handleExportKamaitachi}
					defaultLabel="Export scores as json (for Kamaitachi)"
					updatingLabel="Exporting..."
				/>
			</div>
		</div>
	);
};

export default JsonExport;
