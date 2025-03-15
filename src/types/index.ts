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

// Favorites Related Interfaces
export interface FavoriteSong {
	id?: number;
	title: React.ReactNode;
	chartId: number;
	level: number | React.ReactNode;
	genre: string;
	artist: React.ReactNode;
	icon?: React.ReactNode;
}

export interface ChunithmFavoritesTableProps {
	favorites: FavoriteSong[];
	searchQuery: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// All Songs Related Interfaces
export interface AllSongs {
	id?: number;
	title: React.ReactNode;
	chartId: number;
	level: number | React.ReactNode;
	genre: string;
	artist: React.ReactNode;
	icon?: React.ReactNode;
}

export interface AllSongsTableProps {
	allSongs: AllSongs[];
	searchQuery: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Ongeki Score Related Interfaces
export interface OngekiScore {
	id: number;
	userPlayDate: string;
	maxCombo: number;
	isFullCombo: number;
	playerRating: number;
	isAllBreak: number;
	isFullBell: number;
	techScore: number;
	battleScore: number;
	judgeMiss: number;
	judgeHit: number;
	judgeBreak: number;
	judgeCriticalBreak: number;
	clearStatus: number;
	cardId1: number;
	chartId: number;
	title: string;
	level: number;
	genre: string;
	artist: string;
	rating_change: string;
}

export interface OngekiScoreTableProps {
	scores: OngekiScore[];
	searchQuery: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Chunithm Score Related Interfaces
export interface ChunithmScore {
	id: number;
	userPlayDate: string;
	maxCombo: number;
	isFullCombo: number;
	playerRating: number;
	isAllJustice: number;
	score: number;
	judgeHeaven: number;
	judgeGuilty: number;
	judgeJustice: number;
	judgeAttack: number;
	judgeCritical: number;
	isClear: number;
	skillId: number;
	isNewRecord: number;
	chartId: number;
	title: string;
	level: number;
	genre: string;
	jacketPath: string;
	artist: string;
	rating_change: string;
}

export interface ChunithmScoreTableProps {
	scores: ChunithmScore[];
	searchQuery: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
