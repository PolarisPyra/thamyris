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

export interface User {
	sub: string;
	role: string;
	exp: number;
}

export interface CustomContext {
	Variables: {
		user: User;
	};
}

export interface avatarData {
	image: string;
	label: string;
	avatarAccessoryId: number;
}

export interface mapData {
	image: string;
	label: string;
	avatarAccessoryId: number;
}

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
	level: string | number;
	jacketPath: string;
	rating: number;
}

export interface RatingResponse {
	results: UserRatingBaseEntry[];
	error?: string;
}

export interface Song {
	id: number;
	songId: number;
	chartId: number;
	title: string;
	level: number;
	genre: string;
	artist: string;
	jacketPath: string;
}

export interface SongResponse {
	results: Song[];
	error?: string;
}
