import { InferResponseType } from "hono";

import { api } from "./api";

export interface currentAvatarApiResponse {
	results: currentAvatarParts[];
}

export interface currentAvatarParts {
	avatarFaceTexture: string;
	avatarWearTexture: string;
	avatarBackTexture: string;
	avatarHeadTexture: string;
	avatarItemTexture: string;
}

export interface allAvatarApiResponse {
	results?: allUnlockedOutfits[];
	error?: string;
}

export interface allUnlockedOutfits {
	id: string;
	name: string;
	avatarHeadId: number;
	avatarBackId: number;
	avatarWearId: number;
	avatarFaceId: number;
	avatarItemId: number;
	avatarAccessoryId: number;

	category: string;
	version: string;
	iconPath: string;
	texturePath: string;
}

export interface assetData {
	image: string;
	label: string;
	avatarAccessoryId: number;
}
export type User = InferResponseType<typeof api.users.verify.$post>["user"];

export interface UserRatingBaseEntry {
	type: string;
	version: number;
	index: number;
	musicId: number;
	score: number;
	difficultId: string;
	chartId: number;
	title: string;
	artist: string;
	genre: string;
	level: number;
	jacketPath: string;
	rating: number;
	isFullBell?: boolean;
	isFullCombo?: boolean;
	isAllBreake?: boolean;
	isAllJustice?: boolean;
}

export interface RatingResponse {
	results: UserRatingBaseEntry[];
	error?: string;
}

export interface SongResponse {
	results: Song[];
	error?: string;
}

interface Song {
	id?: number;
	musicId: number;
	title: string;
	score: number;
	level: number;
	chartId: number;
	genre: string;
	artist: string;
	rating: number;
}

export interface RatingFrameTableProps {
	data: Song[];
	title: string;
}
