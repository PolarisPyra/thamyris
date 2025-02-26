import { useQuery } from "@tanstack/react-query";

export const useChunithmVersion = () => {
	return useQuery({
		queryKey: ["chunithmVersion"],
		queryFn: async () => {
			const response = await fetch("/api/chunithm/settings/get");
			if (!response.ok) {
				throw new Error("Failed to fetch version");
			}
			const data = await response.json();
			return Number(data.version);
		},
	});
};
