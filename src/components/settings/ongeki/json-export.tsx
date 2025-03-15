import React from "react";

import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import { useReiwaExport } from "@/hooks/ongeki";

const JsonExport = () => {
	const { data: exportData, isLoading } = useReiwaExport();

	const handleExportB45 = () => {
		if (!exportData) {
			toast.error("No data available to export");
			return;
		}

		const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "ongeki_reiwa_export.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		toast.success("Successfully exported B45 data");
	};

	return (
		<div className="bg-card rounded-md p-4 md:p-6">
			<h2 className="text-primary mb-4 text-xl font-semibold">Export Data</h2>
			<SubmitButton
				onClick={handleExportB45}
				defaultLabel="Export ratings as json (for reiwa.f5.si)"
				updatingLabel="Exporting..."
				disabled={isLoading || !exportData}
			/>
		</div>
	);
};

export default JsonExport;
