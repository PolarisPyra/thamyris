import React, { ReactNode, useCallback } from "react";
import { useEffect, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { ChevronDown, ChevronRight, Music } from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/common/header";
import Spinner from "@/components/common/spinner";
import { SongPicker } from "@/components/ongeki/song-picker";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useCurrentUser } from "@/hooks/users";
import { Song } from "@/types";
import { api } from "@/utils";

type TechEvent = InferResponseType<typeof api.ongeki.techevent.$get>[number];

const TechEventRow = (props: {
	event: TechEvent;
	hasEvent: boolean;
	refetch: () => void;
	showPicker: (eventId: number) => void;
	username: string;
}): ReactNode => {
	const { event, hasEvent, refetch, showPicker, username } = props;
	const { eventId, musicIds, name, ownerUsername } = event;

	const [expanded, setExpanded] = useState(false);
	const toggleExpanded = () => setExpanded(!expanded);
	const isOwned = ownerUsername === username;
	let className = "rounded-full px-2 py-1 text-xs";
	let children = "";
	let disabled = false;
	let onClick = () => {};

	if (!ownerUsername) {
		className += " bg-green-100 text-green-800";
		children = "Claim";
		disabled = hasEvent;
		onClick = async () => {
			const res = await api.ongeki.techevent[":eventId"].claim.$patch({ param: { eventId: eventId.toString() } });
			if (!res.ok) {
				toast.error(res.statusText);
			} else {
				toast.success("Event claimed successfully");
			}
			refetch();
		};
	} else if (isOwned) {
		className += " bg-red-100 text-red-800";
		children = "Disown";
		onClick = async () => {
			const res = await api.ongeki.techevent[":eventId"].unclaim.$patch({ param: { eventId: eventId.toString() } });
			if (!res.ok) {
				toast.error(res.statusText);
			} else {
				toast.success("Event disowned successfully");
			}
			refetch();
		};
	} else {
		className += " bg-gray-100 text-gray-800 disabled";
		children = ownerUsername;
	}

	return useMemo(
		() => (
			<React.Fragment key={event.id}>
				<TableRow onClick={toggleExpanded}>
					<TableCell className="text-primary">
						{expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
					</TableCell>
					<TableCell className="text-primary">{name || "Unnamed Event"}</TableCell>
					<TableCell className="text-primary">
						{!disabled && (
							<Button
								className={className}
								onClick={(e) => {
									e.stopPropagation();
									onClick();
								}}
							>
								{children}
							</Button>
						)}
					</TableCell>
				</TableRow>
				{expanded && (
					<TableRow>
						<TableCell colSpan={7} className="text-primary">
							<div className="ml-6 border-l-2 p-2">
								<h4 className="mb-2 flex items-center text-sm font-semibold">
									<Music className="mr-1 h-4 w-4" />
									Associated Music ({musicIds?.length || 0})
									{isOwned && (
										<Button className="ml-auto" onClick={() => showPicker(eventId)}>
											{"Add Music"}
										</Button>
									)}
								</h4>
								<div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
									{musicIds.map((music) => (
										<div key={music.id} className="rounded border">
											<div className="font-medium">Music ID: {music.id}</div>
											<div className="text-xs text-gray-500">Level: {music.level}</div>
										</div>
									))}
								</div>
							</div>
						</TableCell>
					</TableRow>
				)}
			</React.Fragment>
		),
		[expanded, hasEvent, showPicker]
	);
};

export const TechEvents = () => {
	const { username } = useCurrentUser();
	const [pickerEventId, setPickerEventId] = useState<number>();
	const { data, error, isLoading, refetch } = useQuery({
		queryKey: ["techEvents"],
		queryFn: async () => {
			const response = await api.ongeki.techevent.$get();
			if (!response.ok) {
				throw new Error(response.statusText);
			}

			return response.json();
		},
	});

	const hasEvent = useMemo(() => data?.some((event) => event.ownerUsername === username) || false, [data]);

	useEffect(() => {
		if (error) {
			toast.error(error?.message);
		}
	}, [error]);

	const renderTable = useMemo(() => {
		if (!data || !data.length) {
			return <div className="p-6 text-center">No tech events found</div>;
		}

		return (
			<div className="bg-card rounded-md p-4 sm:p-6">
				<Table>
					<TableBody>
						{data.map((event) => (
							<TechEventRow
								key={event.id}
								event={event}
								hasEvent={hasEvent}
								refetch={refetch}
								showPicker={(eventId) => setPickerEventId(eventId)}
								username={username}
							/>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}, [data]);

	// const getEventType = (type) => {
	// 	const types = {
	// 		0: "Regular",
	// 		1: "Special",
	// 		2: "Collaboration",
	// 		3: "Tournament",
	// 		4: "Seasonal",
	// 	};
	// 	return types[type] || `Type ${type}`;
	// };

	const addSong = useCallback(async (eventId: number, song: Song) => {
		const res = await api.ongeki.techevent[":eventId"].$post({
			param: { eventId: eventId.toString() },
			json: { level: song.level, musicId: song.songId },
		});
		if (!res.ok) {
			toast.error(res.statusText);
		} else {
			toast.success("Song added successfully");
		}
	}, []);

	return useMemo(
		() => (
			<div className="relative flex-1 overflow-auto">
				<SongPicker
					open={!!pickerEventId}
					onSelect={(s) => {
						// pickerCb(s);
						// setPickerCb(null);
						addSong(pickerEventId!, s);
					}}
					onClose={() => {
						setPickerEventId(undefined);
						refetch();
					}}
				/>

				<Header title="Tech Events" />
				<div className="space-y-4">
					{isLoading ? (
						<div className="flex justify-center p-12">
							<Spinner />
						</div>
					) : (
						renderTable
					)}
				</div>
			</div>
		),
		[isLoading, data, pickerEventId]
	);
};
