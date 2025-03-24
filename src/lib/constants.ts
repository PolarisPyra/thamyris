export const cdnUrl = env.CDN_URL;
export const turnstile = env.CFTurnstileKey;

export enum TrophyRareType {
	Normal = 0,
	Bronze = 1,
	Silver = 2,
	Gold = 3,
	Gold2 = 4,
	Platinum = 5,
	Platinum2 = 6,
	Rainbow = 7,
	Staff = 9,
	Ongeki = 10,
	Maimai = 11,
	Duals = 13,
	Idori = 14,
	Lamp = 18,
	Lamp2 = 19,
	Lamp3 = 20,
	Kop = 21,
	Kop2 = 22,
}

export const honorBackgrounds: Record<TrophyRareType, string> = {
	[TrophyRareType.Normal]: `${cdnUrl}assets/honorBackgrounds/honor_bg_normal.png`,
	[TrophyRareType.Bronze]: `${cdnUrl}assets/honorBackgrounds/honor_bg_bronze.png`,
	[TrophyRareType.Silver]: `${cdnUrl}assets/honorBackgrounds/honor_bg_silver.png`,
	[TrophyRareType.Gold]: `${cdnUrl}assets/honorBackgrounds/honor_bg_gold.png`,
	[TrophyRareType.Gold2]: `${cdnUrl}assets/honorBackgrounds/honor_bg_gold.png`,
	[TrophyRareType.Platinum]: `${cdnUrl}assets/honorBackgrounds/honor_bg_platina.png`,
	[TrophyRareType.Platinum2]: `${cdnUrl}assets/honorBackgrounds/honor_bg_platina.png`,
	[TrophyRareType.Rainbow]: `${cdnUrl}assets/honorBackgrounds/honor_bg_rainbow.png`,
	[TrophyRareType.Staff]: `${cdnUrl}assets/honorBackgrounds/honor_bg_staff.png`,
	[TrophyRareType.Ongeki]: `${cdnUrl}assets/honorBackgrounds/honor_bg_ongeki.png`,
	[TrophyRareType.Maimai]: `${cdnUrl}assets/honorBackgrounds/honor_bg_maimai.png`,
	[TrophyRareType.Duals]: `${cdnUrl}assets/honorBackgrounds/honor_bg_platina.png`,
	[TrophyRareType.Idori]: `${cdnUrl}assets/honorBackgrounds/honor_bg_platina.png`,
	[TrophyRareType.Lamp]: ``,
	[TrophyRareType.Lamp2]: ``,
	[TrophyRareType.Lamp3]: ``,
	[TrophyRareType.Kop]: ``,
	[TrophyRareType.Kop2]: ``,
};
