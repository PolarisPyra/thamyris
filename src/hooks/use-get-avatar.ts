import { api } from "@/utils";
import { useEffect } from "react";

export const useFetchAvatarData = (
	setParts: any,
	setInitialClothing: any,
	setAccessoryItems: any,
	setIsLoading: any,
	unlockedAccessoryOptions: any
) => {
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch current avatar
				const currentResponse = await api.chunithm.avatar.current.$get();
				if (currentResponse.ok) {
					const currentData = await currentResponse.json();
					const avatar = currentData.results[0];
					const newClothing = {
						head: avatar.avatarHeadTexture?.replace(".dds", "") || "",
						back: avatar.avatarBackTexture?.replace(".dds", "") || "",
						wear: avatar.avatarWearTexture?.replace(".dds", "") || "",
						face: avatar.avatarFaceTexture?.replace(".dds", "") || "",
						item: avatar.avatarItemTexture?.replace(".dds", "") || "",
					};
					setParts(newClothing);
					setInitialClothing(newClothing);
				}

				// Fetch all parts for dropdown
				const categories = [
					{ id: 1, key: "wear" },
					{ id: 2, key: "head" },
					{ id: 3, key: "face" },
					{ id: 5, key: "item" },
					{ id: 7, key: "back" },
				];

				const unlockedPenguinOutfits = await Promise.all(
					categories.map(async (category) => {
						const response = await api.chunithm.avatar.parts[":category"].$get({
							param: { category: category.id.toString() },
						});
						const data = (await response.json()) as {
							results?: any[];
							error?: string;
						};

						if ("error" in data || !data.results) {
							return {
								key: category.key,
								options: [],
							};
						}

						return {
							key: category.key,
							options: (data as { results: any[] }).results.map(
								(outfitItem: { texturePath?: string; name: string; avatarAccessoryId: string }) => ({
									image: outfitItem.texturePath?.replace(".dds", "") || "",
									label: outfitItem.name,
									avatarAccessoryId: outfitItem.avatarAccessoryId,
								})
							),
						};
					})
				);

				const accessories = unlockedPenguinOutfits.reduce(
					(accumulator, current) => {
						const { key, options } = current;
						accumulator[key as keyof typeof accumulator] = options.map((option) => ({
							...option,
							avatarAccessoryId: Number(option.avatarAccessoryId),
						}));
						return accumulator;
					},
					{
						head: [],
						back: [],
						wear: [],
						face: [],
						item: [],
					} as typeof unlockedAccessoryOptions
				);

				setAccessoryItems(accessories);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);
};
