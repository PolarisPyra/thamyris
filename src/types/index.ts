import { InferResponseType } from "hono";

import { api } from "@/utils";

export type User = InferResponseType<typeof api.users.verify.$post>;

// Avatar Related Interfaces
export interface AvatarParts {
	head: number;
	back: number;
	wear: number;
	face: number;
	item: number;
	image: string;
	label: string;
	avatarHeadTexture?: string;
	avatarFaceTexture?: string;
	avatarBackTexture?: string;
	avatarWearTexture?: string;
	avatarItemTexture?: string;
	avatarAccessoryId?: number;
}

// User Rating Related Interfaces
export interface UserRatingEntry {
	type: string;
	version: number;
	index: number;
	musicId: number;
	score: number;
	difficultyId: string;
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
	results: UserRatingEntry[];
	error?: string;
}

// Song Related Interfaces
export interface Song {
	id?: number;
	songId: number;
	musicId: number;
	title: string;
	score: number;
	level: number;
	chartId: number;
	genre: string;
	artist: string;
	rating: number;
}

export interface SongResponse {
	results: Song[];
	error?: string;
}

export interface RatingTable {
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
	data: RatingTable[];
	title: string;
}

/// avatar use-avatar.ts
export interface AllAvatarApiResponse {
	results?: UnlockedOutfit[];
	error?: string;
}

export interface UnlockedOutfit {
	id: string;
	name: string;
	headId: number;
	backId: number;
	wearId: number;
	faceId: number;
	itemId: number;
	accessoryId: number;
	category: string;
	version: string;
	iconPath: string;
	texturePath: string;
}

export interface Trophy {
	id: number;
	name: string;
	description: string;
	rareType: number;
	trophyId: number;
}
