import React from "react";

import MapiconSelector from "@/components/chunithm/mapicon-customization";
import NameplateSelector from "@/components/chunithm/nameplate-customization";
import PenguinDressup from "@/components/chunithm/penguin-dressup";
import SystemvoiceSelector from "@/components/chunithm/systemvoice-customization";
import TrophySelector from "@/components/chunithm/trophies";
import Header from "@/components/common/header";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";

const ChunithmUserbox = () => {
	const { data: version } = useChunithmVersion();

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={"Userbox"} />
			{version ? (
				<div className="flex flex-col items-center">
					<PenguinDressup />
					<NameplateSelector />
					<TrophySelector />

					<SystemvoiceSelector />
					<MapiconSelector />
				</div>
			) : (
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<p className="text-primary">Please set your Chunithm version in settings first</p>
				</div>
			)}
		</div>
	);
};

export default ChunithmUserbox;
