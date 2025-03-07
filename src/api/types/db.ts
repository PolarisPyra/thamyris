/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Database type definitions for the application tables
 */
export namespace DB {
	export interface AimeUser {
		id: number;
		username: string;
		email: string;
		password: string;
		permissions: number;
		created_date: string;
		last_login_date: string;
		suspend_expire_time: string;
	}

	export interface AimeCard {
		id: number;
		user: number;
		access_code: string;
		idm: string;
		chip_id: number;
		created_date: string;
		last_login_date: string;
		is_locked: boolean;
		is_banned: boolean;
		memo: string;
	}
	export interface AimeUserGameLocks {
		id: number;
		user: number;
		game: string;
		expires_at: string | null;
		extra: string | null;
	}
	export interface Arcade {
		id: number;
		name: string | null;
		nickname: string | null;
		country: string | null;
		country_id: number | null;
		state: string | null;
		city: string | null;
		region_id: number | null;
		timezone: string | null;
		ip: string | null;
	}
	export interface ArcadeOwner {
		user: number;
		arcade: number;
		permissions: number;
	}
	export interface ChuniClientBookkeeping {
		id: number;
		placeId: number;
		clientId: string;
		updateDate: string;
		coinCredit: number;
		serviceCredit: number;
		eMoneyCredit: number;
		totalRunningTime: number;
		totalPlayTime: number;
		averagePlayTime: number;
		longestPlayTime: number;
		shortestPlayTime: number;
		totalCredit: number;
		freePlayNum: number;
		creditPlayNum: number;
		totalPlayNum: number;
		firstTutorialNum: number;
		masterTutorialNum: number;
		playRatio: number;
		continueNum: number;
	}
	export interface ChuniClientDevelop {
		id: number;
		placeId: number;
		clientId: string;
		orderId: number;
		sortNumber: number;
		updateDate: string;
		devId: number;
		devValue: number;
	}
	export interface ChuniClientError {
		id: number;
		placeId: number;
		clientId: string;
		orderId: number;
		sortNumber: number;
		updateDate: string;
		errorNo: number;
		totalCount: number;
	}

	export interface ChuniClientSetting {
		id: number;
		placeId: number;
		clientId: string;
		placeName: string;
		regionId: number;
		regionName: string;
		allNetId: number;
		bordId: string;
		romVersion: string;
		dataVersion: string;
		dumpFileNum: number;
	}
	export interface ChuniClientTestmode {
		id: number;
		placeId: number;
		clientId: string;
		updateDate: string;
		isDelivery: boolean;
		groupId: number;
		groupRole: number;
		continueMode: number;
		selectMusicTime: number;
		advertiseVolume: number;
		eventMode: number;
		eventMusicNum: number;
		machineType: number;
		monitorFps: number;
	}
	export interface ChuniItemCharacter {
		id: number;
		user: number;
		characterId: number | null;
		level: number | null;
		param1: number | null;
		param2: number | null;
		isValid: boolean | null;
		skillId: number | null;
		isNewMark: boolean | null;
		playCount: number | null;
		friendshipExp: number | null;
		assignIllust: number | null;
		exMaxLv: number | null;
	}
	export interface ChuniItemCmission {
		id: number;
		user: number;
		missionId: number;
		point: number | null;
	}
	export interface ChuniItemCmissionProgress {
		id: number;
		user: number;
		missionId: number;
		order: number | null;
		stage: number | null;
		progress: number | null;
	}
	export interface ChuniItemDuel {
		id: number;
		user: number;
		duelId: number | null;
		progress: number | null;
		point: number | null;
		isClear: boolean | null;
		lastPlayDate: string | null;
		param1: number | null;
		param2: number | null;
		param3: number | null;
		param4: number | null;
	}
	export interface ChuniItemFavorite {
		id: number;
		user: number;
		version: number;
		favId: number;
		favKind: number;
	}
	export interface ChuniItemGacha {
		id: number;
		user: number;
		gachaId: number;
		totalGachaCnt: number;
		ceilingGachaCnt: number;
		dailyGachaCnt: number;
		fiveGachaCnt: number;
		elevenGachaCnt: number;
		dailyGachaDate: string;
	}
	export interface ChuniItemItem {
		id: number;
		user: number;
		itemId: number | null;
		itemKind: number | null;
		stock: number | null;
		isValid: boolean | null;
	}
	export interface ChuniItemLoginBonus {
		id: number;
		user: number;
		version: number;
		presetId: number;
		bonusCount: number;
		lastUpdateDate: string | null;
		isWatched: boolean | null;
		isFinished: boolean | null;
	}
	export interface ChuniItemMap {
		id: number;
		user: number;
		mapId: number | null;
		position: number | null;
		isClear: boolean | null;
		areaId: number | null;
		routeNumber: number | null;
		eventId: number | null;
		rate: number | null;
		statusCount: number | null;
		isValid: boolean | null;
	}
	export interface ChuniItemMapArea {
		id: number;
		user: number;
		mapAreaId: number | null;
		rate: number | null;
		isClear: boolean | null;
		isLocked: boolean | null;
		position: number | null;
		statusCount: number | null;
		remainGridCount: number | null;
	}
	export interface ChuniItemMatching {
		roomId: number;
		user: number;
		version: number;
		restMSec: number;
		isFull: boolean;
		matchingMemberInfoList: string;
	}
	export interface ChuniItemPrintDetail {
		id: number;
		user: number;
		cardId: number;
		printDate: string;
		serialId: string;
		placeId: number;
		clientId: string;
		printerSerialId: string;
		printOption1: boolean;
		printOption2: boolean;
		printOption3: boolean;
		printOption4: boolean;
		printOption5: boolean;
		printOption6: boolean;
		printOption7: boolean;
		printOption8: boolean;
		printOption9: boolean;
		printOption10: boolean;
		created: string;
	}
	export interface ChuniItemPrintState {
		id: number;
		user: number;
		hasCompleted: boolean;
		limitDate: string;
		placeId: number | null;
		cardId: number | null;
		gachaId: number | null;
	}
	export interface ChuniProfileActivity {
		id: number;
		user: number;
		kind: number | null;
		activityId: number | null;
		sortNumber: number | null;
		param1: number | null;
		param2: number | null;
		param3: number | null;
		param4: number | null;
	}
	export interface ChuniProfileCharge {
		id: number;
		user: number;
		chargeId: number | null;
		stock: number | null;
		purchaseDate: string | null;
		validDate: string | null;
		param1: number | null;
		param2: number | null;
		paramDate: string | null;
	}
	export interface ChuniProfileData {
		id: number;
		user: number;
		version: number;
		exp: number | null;
		level: number | null;
		point: number | null;
		frameId: number | null;
		isMaimai: boolean | null;
		trophyId: number | null;
		userName: string | null;
		isWebJoin: boolean | null;
		playCount: number | null;
		lastGameId: string | null;
		totalPoint: number | null;
		characterId: number | null;
		firstGameId: string | null;
		friendCount: number | null;
		lastPlaceId: number | null;
		nameplateId: number | null;
		totalMapNum: number | null;
		lastAllNetId: number | null;
		lastClientId: string | null;
		lastPlayDate: string | null;
		lastRegionId: number | null;
		playerRating: number | null;
		totalHiScore: number | null;
		webLimitDate: string | null;
		firstPlayDate: string | null;
		highestRating: number | null;
		lastPlaceName: string | null;
		multiWinCount: number | null;
		acceptResCount: number | null;
		lastRegionName: string | null;
		lastRomVersion: string | null;
		multiPlayCount: number | null;
		firstRomVersion: string | null;
		lastDataVersion: string | null;
		requestResCount: number | null;
		successResCount: number | null;
		eventWatchedDate: string | null;
		firstDataVersion: string | null;
		reincarnationNum: number | null;
		playedTutorialBit: number | null;
		totalBasicHighScore: number | null;
		totalExpertHighScore: number | null;
		totalMasterHighScore: number | null;
		totalRepertoireCount: number | null;
		firstTutorialCancelNum: number | null;
		totalAdvancedHighScore: number | null;
		masterTutorialCancelNum: number | null;
		ext1: number | null;
		ext2: number | null;
		ext3: number | null;
		ext4: number | null;
		ext5: number | null;
		ext6: number | null;
		ext7: number | null;
		ext8: number | null;
		ext9: number | null;
		ext10: number | null;
		extStr1: string | null;
		extStr2: string | null;
		extLong1: number | null;
		extLong2: number | null;
		mapIconId: number | null;
		compatibleCmVersion: string | null;
		medal: number | null;
		voiceId: number | null;
		teamId: number | null;
		eliteRankPoint: number;
		stockedGridCount: number;
		netBattleLoseCount: number;
		netBattleHostErrCnt: number;
		netBattle4thCount: number;
		overPowerRate: number;
		battleRewardStatus: number;
		netBattle1stCount: number;
		charaIllustId: number;
		userNameEx: string;
		netBattleWinCount: number;
		netBattleCorrection: number;
		classEmblemMedal: number;
		overPowerPoint: number;
		netBattleErrCnt: number;
		battleRankId: number;
		netBattle3rdCount: number;
		netBattleConsecutiveWinCount: number;
		overPowerLowerRank: number;
		classEmblemBase: number;
		battleRankPoint: number;
		netBattle2ndCount: number;
		totalUltimaHighScore: number;
		skillId: number;
		lastCountryCode: string;
		isNetBattleHost: boolean;
		battleRewardCount: number;
		battleRewardIndex: number;
		netBattlePlayCount: number;
		exMapLoopCount: number;
		netBattleEndState: number;
		rankUpChallengeResults: string | null;
		avatarBack: number;
		avatarFace: number;
		avatarPoint: number;
		avatarItem: number;
		avatarWear: number;
		avatarFront: number;
		avatarSkin: number;
		avatarHead: number;
		trophyIdSub1: number | null;
		trophyIdSub2: number | null;
	}
	export interface ChuniProfileDataEx {
		id: number;
		user: number;
		version: number;
		ext1: number | null;
		ext2: number | null;
		ext3: number | null;
		ext4: number | null;
		ext5: number | null;
		ext6: number | null;
		ext7: number | null;
		ext8: number | null;
		ext9: number | null;
		ext10: number | null;
		ext11: number | null;
		ext12: number | null;
		ext13: number | null;
		ext14: number | null;
		ext15: number | null;
		ext16: number | null;
		ext17: number | null;
		ext18: number | null;
		ext19: number | null;
		ext20: number | null;
		medal: number | null;
		extStr1: string | null;
		extStr2: string | null;
		extStr3: string | null;
		extStr4: string | null;
		extStr5: string | null;
		voiceId: number | null;
		extLong1: number | null;
		extLong2: number | null;
		extLong3: number | null;
		extLong4: number | null;
		extLong5: number | null;
		mapIconId: number | null;
		compatibleCmVersion: string | null;
	}
	export interface ChuniProfileEmoney {
		id: number;
		user: number;
		ext1: number | null;
		ext2: number | null;
		ext3: number | null;
		type: number | null;
		emoneyBrand: number | null;
		emoneyCredit: number | null;
	}
	export interface ChuniProfileNetBattle {
		id: number;
		user: number;
		isRankUpChallengeFailed: boolean | null;
		highestBattleRankId: number | null;
		battleIconId: number | null;
		battleIconNum: number | null;
		avatarEffectPoint: number | null;
	}
	export interface ChuniProfileOption {
		id: number;
		user: number;
		speed: number | null;
		bgInfo: number | null;
		rating: number | null;
		privacy: number | null;
		judgePos: number | null;
		matching: number | null;
		guideLine: number | null;
		headphone: number | null;
		optionSet: number | null;
		fieldColor: number | null;
		guideSound: number | null;
		successAir: number | null;
		successTap: number | null;
		judgeAttack: number | null;
		playerLevel: number | null;
		soundEffect: number | null;
		judgeJustice: number | null;
		successExTap: number | null;
		successFlick: number | null;
		successSkill: number | null;
		successSlideHold: number | null;
		successTapTimbre: number | null;
		ext1: number | null;
		ext2: number | null;
		ext3: number | null;
		ext4: number | null;
		ext5: number | null;
		ext6: number | null;
		ext7: number | null;
		ext8: number | null;
		ext9: number | null;
		ext10: number | null;
		categoryDetail: number;
		judgeTimingOffset_120: number;
		resultVoiceShort: number;
		judgeAppendSe: number;
		judgeCritical: number;
		trackSkip: number;
		selectMusicFilterLv: number;
		sortMusicFilterLv: number;
		sortMusicGenre: number;
		speed_120: number;
		judgeTimingOffset: number;
		mirrorFumen: number;
		playTimingOffset_120: number;
		hardJudge: number;
		notesThickness: number;
		fieldWallPosition: number;
		playTimingOffset: number;
		fieldWallPosition_120: number;
	}
	export interface ChuniProfileOptionEx {
		id: number;
		user: number;
		ext1: number | null;
		ext2: number | null;
		ext3: number | null;
		ext4: number | null;
		ext5: number | null;
		ext6: number | null;
		ext7: number | null;
		ext8: number | null;
		ext9: number | null;
		ext10: number | null;
		ext11: number | null;
		ext12: number | null;
		ext13: number | null;
		ext14: number | null;
		ext15: number | null;
		ext16: number | null;
		ext17: number | null;
		ext18: number | null;
		ext19: number | null;
		ext20: number | null;
	}
	export interface ChuniProfileOverpower {
		id: number;
		user: number;
		genreId: number | null;
		difficulty: number | null;
		rate: number | null;
		point: number | null;
	}
	export interface ChuniProfileRating {
		id: number;
		user: number;
		version: number;
		type: string;
		index: number;
		musicId: number | null;
		difficultId: number | null;
		romVersionCode: number | null;
		score: number | null;
	}
	export interface ChuniProfileRecentRating {
		id: number;
		user: number;
		recentRating: string | null;
	}
	export interface ChuniProfileRegion {
		id: number;
		user: number;
		regionId: number | null;
		playCount: number | null;
	}
	export interface ChuniProfileTeam {
		id: number;
		teamName: string | null;
		teamPoint: number | null;
		userTeamPoint: string | null;
	}
	export interface ChuniProfileUnlockChallenge {
		id: number;
		user: number;
		unlockChallengeId: number | null;
		status: number | null;
		clearCourseId: number | null;
		conditionType: number | null;
		score: number | null;
		life: number | null;
		clearDate: string | null;
	}
	export interface ChuniScoreBest {
		id: number;
		user: number;
		musicId: number | null;
		level: number | null;
		playCount: number | null;
		scoreMax: number | null;
		resRequestCount: number | null;
		resAcceptCount: number | null;
		resSuccessCount: number | null;
		missCount: number | null;
		maxComboCount: number | null;
		isFullCombo: boolean | null;
		isAllJustice: boolean | null;
		isSuccess: number | null;
		fullChain: number | null;
		maxChain: number | null;
		scoreRank: number | null;
		isLock: boolean | null;
		ext1: number | null;
		theoryCount: number | null;
	}
	export interface ChuniScoreCourse {
		id: number;
		user: number;
		courseId: number | null;
		classId: number | null;
		playCount: number | null;
		scoreMax: number | null;
		isFullCombo: boolean | null;
		isAllJustice: boolean | null;
		isSuccess: boolean | null;
		scoreRank: number | null;
		eventId: number | null;
		lastPlayDate: string | null;
		param1: number | null;
		param2: number | null;
		param3: number | null;
		param4: number | null;
		isClear: boolean | null;
		theoryCount: number | null;
		orderId: number | null;
		playerRating: number | null;
	}
	export interface ChuniScorePlaylog {
		id: number;
		user: number;
		orderId: number | null;
		sortNumber: number | null;
		placeId: number | null;
		playDate: string | null;
		userPlayDate: string | null;
		musicId: number | null;
		level: number | null;
		customId: number | null;
		playedUserId1: number | null;
		playedUserId2: number | null;
		playedUserId3: number | null;
		playedUserName1: string | null;
		playedUserName2: string | null;
		playedUserName3: string | null;
		playedMusicLevel1: number | null;
		playedMusicLevel2: number | null;
		playedMusicLevel3: number | null;
		playedCustom1: number | null;
		playedCustom2: number | null;
		playedCustom3: number | null;
		track: number | null;
		score: number | null;
		rank: number | null;
		maxCombo: number | null;
		maxChain: number | null;
		rateTap: number | null;
		rateHold: number | null;
		rateSlide: number | null;
		rateAir: number | null;
		rateFlick: number | null;
		judgeGuilty: number | null;
		judgeAttack: number | null;
		judgeJustice: number | null;
		judgeCritical: number | null;
		eventId: number | null;
		playerRating: number | null;
		isNewRecord: boolean | null;
		isFullCombo: boolean | null;
		fullChainKind: number | null;
		isAllJustice: boolean | null;
		isContinue: boolean | null;
		isFreeToPlay: boolean | null;
		characterId: number | null;
		skillId: number | null;
		playKind: number | null;
		isClear: boolean | null;
		skillLevel: number | null;
		skillEffect: number | null;
		placeName: string | null;
		isMaimai: boolean | null;
		commonId: number | null;
		charaIllustId: number | null;
		romVersion: string | null;
		judgeHeaven: number | null;
		regionId: number | null;
		machineType: number | null;
		ticketId: number | null;
		monthPoint: number | null;
		eventPoint: number | null;
	}
	export interface ChuniStaticAvatar {
		id: number;
		version: number;
		avatarAccessoryId: number | null;
		name: string | null;
		category: number | null;
		iconPath: string | null;
		texturePath: string | null;
	}
	export interface ChuniStaticCards {
		id: number;
		version: number;
		cardId: number;
		charaName: string;
		charaId: number;
		presentName: string;
		rarity: number;
		labelType: number;
		difType: number;
		miss: number;
		combo: number;
		chain: number;
		skillName: string;
	}
	export interface ChuniStaticCharge {
		id: number;
		version: number;
		chargeId: number | null;
		name: string | null;
		expirationDays: number | null;
		consumeType: number | null;
		sellingAppeal: boolean | null;
		enabled: boolean;
	}
	export interface ChuniStaticEvents {
		id: number;
		version: number;
		eventId: number | null;
		type: number | null;
		name: string | null;
		startDate: string | null;
		enabled: boolean;
	}
	export interface ChuniStaticGachaCards {
		id: number;
		gachaId: number;
		cardId: number;
		rarity: number;
		weight: number;
		isPickup: boolean;
	}
	export interface ChuniStaticGachas {
		id: number;
		version: number;
		gachaId: number;
		gachaName: string;
		type: number;
		kind: number;
		isCeiling: boolean;
		ceilingCnt: number;
		changeRateCnt1: number;
		changeRateCnt2: number;
		startDate: string | null;
		endDate: string | null;
		noticeStartDate: string | null;
		noticeEndDate: string | null;
	}
	export interface ChuniStaticLoginBonus {
		id: number;
		version: number;
		presetId: number;
		loginBonusId: number;
		loginBonusName: string;
		presentId: number;
		presentName: string;
		itemNum: number;
		needLoginDayCount: number;
		loginBonusCategoryType: number;
	}
	export interface ChuniStaticLoginBonusPreset {
		presetId: number;
		version: number;
		presetName: string;
		isEnabled: boolean;
	}
	export interface ChuniStaticMusic {
		id: number;
		version: number;
		songId: number | null;
		chartId: number | null;
		title: string | null;
		artist: string | null;
		level: number | null;
		genre: string | null;
		jacketPath: string | null;
		worldsEndTag: string | null;
	}

	export interface DaphnisStaticCharacter {
		id: number;
		version: number;
		characterId: number;
		name: string;
		sortName: string;
		rareType: number;
		works: string | null;
		illustratorName: string | null;
		imagePath: string;
	}

	export interface DaphnisStaticMapIcon {
		id: number;
		version: number;
		mapIconId: number;
		name: string;
		sortName: string;
		explainText: string;
		imagePath: string;
	}

	export interface DaphnisStaticNameplate {
		id: number;
		version: number;
		nameplateId: number;
		name: string;
		sortName: string;
		explainText: string;
		imagePath: string;
	}
	export interface DaphnisStaticSkill {
		id: number;
		version: number;
		skillId: number;
		name: string;
		skillVersion: number | null;
		categoryId: number;
		categoryName: string;
	}
	export interface DaphnisStaticSystemVoice {
		id: number;
		version: number;
		systemVoiceId: number;
		name: string;
		explainText: string;
		imagePath: string;
	}

	export interface DaphnisStaticTicket {
		id: number;
		version: number;
		ticketId: number;
		name: string;
		type: number;
		target: number;
		stockMaxNum: number;
		explainText: string;
		imagePath: string;
	}
	export interface DaphnisStaticTrophy {
		id: number;
		version: number;
		trophyId: number;
		name: string;
		explainText: string;
		rareType: number;
		imagePath: string | null;
	}
	export interface DaphnisUserOption {
		id: number;
		user: number;
		key: string;
		value: string | null;
	}

	export interface Machine {
		id: number;
		arcade: number;
		serial: string;
		board: string | null;
		game: string | null;
		country: string | null;
		timezone: string | null;
		ota_enable: boolean | null;
		memo: string | null;
		is_cab: boolean | null;
		data: string | null;
	}

	export interface OngekiGpLog {
		id: number;
		user: number | null;
		usedCredit: number | null;
		placeName: string | null;
		trxnDate: string | null;
		placeId: number | null;
		kind: number | null;
		pattern: number | null;
		currentGP: number | null;
	}
	export interface OngekiProfileActivity {
		id: number;
		user: number;
		kind: number | null;
		activityId: number | null;
		sortNumber: number | null;
		param1: number | null;
		param2: number | null;
		param3: number | null;
		param4: number | null;
	}
	export interface OngekiProfileData {
		id: number;
		user: number;
		version: number;
		userName: string | null;
		level: number | null;
		reincarnationNum: number | null;
		exp: number | null;
		point: number | null;
		totalPoint: number | null;
		playCount: number | null;
		jewelCount: number | null;
		totalJewelCount: number | null;
		medalCount: number | null;
		playerRating: number | null;
		highestRating: number | null;
		battlePoint: number | null;
		nameplateId: number | null;
		trophyId: number | null;
		cardId: number | null;
		characterId: number | null;
		characterVoiceNo: number | null;
		tabSetting: number | null;
		tabSortSetting: number | null;
		cardCategorySetting: number | null;
		cardSortSetting: number | null;
		playedTutorialBit: number | null;
		firstTutorialCancelNum: number | null;
		sumTechHighScore: number | null;
		sumTechBasicHighScore: number | null;
		sumTechAdvancedHighScore: number | null;
		sumTechExpertHighScore: number | null;
		sumTechMasterHighScore: number | null;
		sumTechLunaticHighScore: number | null;
		sumBattleHighScore: number | null;
		sumBattleBasicHighScore: number | null;
		sumBattleAdvancedHighScore: number | null;
		sumBattleExpertHighScore: number | null;
		sumBattleMasterHighScore: number | null;
		sumBattleLunaticHighScore: number | null;
		eventWatchedDate: string | null;
		cmEventWatchedDate: string | null;
		firstGameId: string | null;
		firstRomVersion: string | null;
		firstDataVersion: string | null;
		firstPlayDate: string | null;
		lastGameId: string | null;
		lastRomVersion: string | null;
		lastDataVersion: string | null;
		compatibleCmVersion: string | null;
		lastPlayDate: string | null;
		lastPlaceId: number | null;
		lastPlaceName: string | null;
		lastRegionId: number | null;
		lastRegionName: string | null;
		lastAllNetId: number | null;
		lastClientId: string | null;
		lastUsedDeckId: number | null;
		lastPlayMusicLevel: number | null;
		banStatus: number;
		rivalScoreCategorySetting: number;
		overDamageBattlePoint: number;
		bestBattlePoint: number;
		lastEmoneyBrand: number;
		lastEmoneyCredit: number;
		isDialogWatchedSuggestMemory: boolean;
	}
	export interface OngekiProfileKop {
		id: number;
		user: number | null;
		authKey: number | null;
		kopId: number | null;
		areaId: number | null;
		totalTechScore: number | null;
		totalPlatinumScore: number | null;
		techRecordDate: string | null;
		isTotalTechNewRecord: boolean | null;
	}
	export interface OngekiProfileOption {
		id: number;
		user: number;
		optionSet: number | null;
		speed: number | null;
		mirror: number | null;
		judgeTiming: number | null;
		judgeAdjustment: number | null;
		abort: number | null;
		tapSound: number | null;
		volGuide: number | null;
		volAll: number | null;
		volTap: number | null;
		volCrTap: number | null;
		volHold: number | null;
		volSide: number | null;
		volFlick: number | null;
		volBell: number | null;
		volEnemy: number | null;
		volSkill: number | null;
		volDamage: number | null;
		colorField: number | null;
		colorLaneBright: number | null;
		colorLane: number | null;
		colorSide: number | null;
		effectDamage: number | null;
		effectPos: number | null;
		judgeDisp: number | null;
		judgePos: number | null;
		judgeBreak: number | null;
		judgeHit: number | null;
		platinumBreakDisp: number | null;
		judgeCriticalBreak: number | null;
		matching: number | null;
		dispPlayerLv: number | null;
		dispRating: number | null;
		dispBP: number | null;
		headphone: number | null;
		stealthField: number | null;
		colorWallBright: number | null;
	}
	export interface OngekiProfileRating {
		id: number;
		user: number;
		version: number;
		type: string;
		index: number;
		musicId: number | null;
		difficultId: number | null;
		romVersionCode: number | null;
		score: number | null;
	}
	export interface OngekiProfileRatingLog {
		id: number;
		user: number;
		highestRating: number | null;
		dataVersion: string | null;
	}

	export interface OngekiProfileRecentRating {
		id: number;
		user: number;
		recentRating: string | null;
	}
	export interface OngekiProfileRegion {
		id: number;
		user: number;
		regionId: number | null;
		playCount: number | null;
		created: string | null;
	}
	export interface OngekiProfileRival {
		id: number;
		user: number | null;
		rivalUserId: number | null;
	}
	export interface OngekiProfileTrainingRoom {
		id: number;
		user: number | null;
		roomId: number | null;
		authKey: number | null;
		cardId: number | null;
		valueDate: string | null;
	}
	export interface OngekiScoreBest {
		id: number;
		user: number;
		musicId: number;
		level: number;
		playCount: number;
		techScoreMax: number;
		techScoreRank: number;
		battleScoreMax: number;
		battleScoreRank: number;
		maxComboCount: number;
		maxOverKill: number;
		maxTeamOverKill: number;
		isFullBell: boolean;
		isFullCombo: boolean;
		isAllBreake: boolean;
		isLock: boolean;
		clearStatus: number;
		isStoryWatched: boolean;
		platinumScoreMax: number | null;
	}
	export interface OngekiScorePlaylog {
		id: number;
		user: number;
		sortNumber: number | null;
		placeId: number | null;
		placeName: string | null;
		playDate: string | null;
		userPlayDate: string | null;
		musicId: number | null;
		level: number | null;
		playKind: number | null;
		eventId: number | null;
		eventName: string | null;
		eventPoint: number | null;
		playedUserId1: number | null;
		playedUserId2: number | null;
		playedUserId3: number | null;
		playedUserName1: string | null;
		playedUserName2: string | null;
		playedUserName3: string | null;
		playedMusicLevel1: number | null;
		playedMusicLevel2: number | null;
		playedMusicLevel3: number | null;
		cardId1: number | null;
		cardId2: number | null;
		cardId3: number | null;
		cardLevel1: number | null;
		cardLevel2: number | null;
		cardLevel3: number | null;
		cardAttack1: number | null;
		cardAttack2: number | null;
		cardAttack3: number | null;
		bossCharaId: number | null;
		bossLevel: number | null;
		bossAttribute: number | null;
		clearStatus: number | null;
		techScore: number | null;
		techScoreRank: number | null;
		battleScore: number | null;
		battleScoreRank: number | null;
		maxCombo: number | null;
		judgeMiss: number | null;
		judgeHit: number | null;
		judgeBreak: number | null;
		judgeCriticalBreak: number | null;
		rateTap: number | null;
		rateHold: number | null;
		rateFlick: number | null;
		rateSideTap: number | null;
		rateSideHold: number | null;
		bellCount: number | null;
		totalBellCount: number | null;
		damageCount: number | null;
		overDamage: number | null;
		isTechNewRecord: boolean | null;
		isBattleNewRecord: boolean | null;
		isOverDamageNewRecord: boolean | null;
		isFullCombo: boolean | null;
		isFullBell: boolean | null;
		isAllBreak: boolean | null;
		playerRating: number | null;
		battlePoint: number | null;
		platinumScore: number | null;
		platinumScoreMax: number | null;
	}
	export interface OngekiScoreTechCount {
		id: number;
		user: number;
		levelId: number;
		allBreakCount: number | null;
		allBreakPlusCount: number | null;
	}
	export interface OngekiSessionLog {
		id: number;
		user: number | null;
		sortNumber: number | null;
		placeId: number | null;
		playDate: string | null;
		userPlayDate: string | null;
		isPaid: boolean | null;
	}
	export interface OngekiStaticCards {
		id: number;
		version: number;
		cardId: number;
		name: string;
		charaId: number;
		nickName: string | null;
		school: string;
		attribute: string;
		gakunen: string;
		rarity: number;
		levelParam: string;
		skillId: number;
		choKaikaSkillId: number;
		cardNumber: string | null;
	}
	export interface OngekiStaticClientTestmode {
		id: number;
		regionId: number;
		placeId: number;
		clientId: string;
		updateDate: string;
		isDelivery: boolean;
		groupId: number;
		groupRole: number;
		continueMode: number;
		selectMusicTime: number;
		advertiseVolume: number;
		eventMode: number;
		eventMusicNum: number;
		patternGp: number;
		limitGp: number;
		maxLeverMovable: number;
		minLeverMovable: number;
	}
	export interface OngekiStaticEvents {
		id: number;
		version: number | null;
		eventId: number | null;
		type: number | null;
		name: string | null;
		startDate: string | null;
		enabled: boolean;
		endDate: string;
	}
	export interface OngekiStaticGachaCards {
		id: number;
		gachaId: number;
		cardId: number;
		rarity: number;
		weight: number;
		isPickup: boolean;
		isSelect: boolean;
	}
	export interface OngekiStaticGachas {
		id: number;
		version: number;
		gachaId: number;
		gachaName: string;
		type: number;
		kind: number;
		isCeiling: boolean;
		maxSelectPoint: number;
		ceilingCnt: number;
		changeRateCnt1: number;
		changeRateCnt2: number;
		startDate: string | null;
		endDate: string | null;
		noticeStartDate: string | null;
		noticeEndDate: string | null;
		convertEndDate: string | null;
	}

	export interface OngekiStaticGamePoint {
		id: number;
		type: number;
		cost: number;
		startDate: string;
		endDate: string;
	}

	export interface OngekiStaticMusic {
		id: number;
		version: number | null;
		songId: number | null;
		chartId: number | null;
		title: string | null;
		artist: string | null;
		genre: string | null;
		level: number | null;
	}

	export interface OngekiStaticMusicRankingList {
		id: number;
		version: number;
		musicId: number;
		point: number;
		userName: string | null;
	}

	export interface OngekiStaticPresentList {
		id: number;
		version: number;
		presentId: number;
		presentName: string;
		rewardId: number;
		stock: number;
		message: string | null;
		startDate: string;
		endDate: string;
	}
	export interface OngekiStaticRewards {
		id: number;
		version: number;
		rewardId: number;
		rewardName: string;
		itemKind: number;
		itemId: number;
	}
	export interface OngekiStaticTechMusic {
		id: number;
		version: number;
		eventId: number;
		musicId: number;
		level: number;
	}
	export interface OngekiTechEventRanking {
		id: number;
		user: number;
		version: number;
		date: string | null;
		eventId: number;
		rank: number | null;
		totalPlatinumScore: number;
		totalTechScore: number;
	}

	export interface OngekiUserBoss {
		id: number;
		user: number | null;
		musicId: number | null;
		damage: number | null;
		isClear: boolean | null;
		eventId: number | null;
	}
	export interface OngekiUserCard {
		id: number;
		user: number | null;
		cardId: number | null;
		digitalStock: number | null;
		analogStock: number | null;
		level: number | null;
		maxLevel: number | null;
		exp: number | null;
		printCount: number | null;
		useCount: number | null;
		isNew: boolean | null;
		kaikaDate: string | null;
		choKaikaDate: string | null;
		skillId: number | null;
		isAcquired: boolean | null;
		created: string | null;
	}
	export interface OngekiUserChapter {
		id: number;
		user: number | null;
		chapterId: number | null;
		jewelCount: number | null;
		isStoryWatched: boolean | null;
		isClear: boolean | null;
		lastPlayMusicId: number | null;
		lastPlayMusicCategory: number | null;
		lastPlayMusicLevel: number | null;
		skipTiming1: number | null;
		skipTiming2: number | null;
	}
	export interface OngekiUserCharacter {
		id: number;
		user: number | null;
		characterId: number | null;
		costumeId: number | null;
		attachmentId: number | null;
		playCount: number | null;
		intimateLevel: number | null;
		intimateCount: number | null;
		intimateCountRewarded: number | null;
		intimateCountDate: string | null;
		isNew: boolean | null;
	}

	export interface OngekiUserDeck {
		id: number;
		user: number | null;
		deckId: number | null;
		cardId1: number | null;
		cardId2: number | null;
		cardId3: number | null;
	}
	export interface OngekiUserEventMusic {
		id: number;
		user: number | null;
		eventId: number | null;
		type: number | null;
		musicId: number | null;
		level: number | null;
		techScoreMax: number | null;
		platinumScoreMax: number | null;
		techRecordDate: string | null;
		isTechNewRecord: boolean | null;
	}
	export interface OngekiUserEventPoint {
		id: number;
		user: number | null;
		eventId: number | null;
		point: number | null;
		isRankingRewarded: boolean | null;
		version: number;
		rank: number | null;
		type: number;
		date: string | null;
	}
	export interface OngekiUserGacha {
		id: number;
		user: number;
		gachaId: number;
		totalGachaCnt: number;
		ceilingGachaCnt: number;
		selectPoint: number;
		useSelectPoint: number;
		dailyGachaCnt: number;
		fiveGachaCnt: number;
		elevenGachaCnt: number;
		dailyGachaDate: string;
	}

	export interface OngekiUserGachaSupply {
		id: number;
		user: number;
		cardId: number;
	}
	export interface OngekiUserItem {
		id: number;
		user: number | null;
		itemKind: number | null;
		itemId: number | null;
		stock: number | null;
		isValid: boolean | null;
	}
	export interface OngekiUserLoginBonus {
		id: number;
		user: number | null;
		bonusId: number | null;
		bonusCount: number | null;
		lastUpdateDate: string | null;
	}
	export interface OngekiUserMemoryChapter {
		id: number;
		user: number | null;
		chapterId: number | null;
		gaugeId: number | null;
		gaugeNum: number | null;
		jewelCount: number | null;
		isStoryWatched: boolean | null;
		isBossWatched: boolean | null;
		isDialogWatched: boolean | null;
		isEndingWatched: boolean | null;
		isClear: boolean | null;
		lastPlayMusicId: number | null;
		lastPlayMusicLevel: number | null;
		lastPlayMusicCategory: number | null;
	}
	export interface OngekiUserMissionPoint {
		id: number;
		user: number | null;
		eventId: number | null;
		point: number | null;
		version: number;
	}
	export interface OngekiUserMusicItem {
		id: number;
		user: number | null;
		musicId: number | null;
		status: number | null;
	}
	export interface OngekiUserPrintDetail {
		id: number;
		user: number;
		cardId: number;
		cardType: number;
		printDate: string;
		serialId: string;
		placeId: number;
		clientId: string;
		printerSerialId: string;
		isHolograph: boolean;
		isAutographed: boolean;
		printOption1: boolean;
		printOption2: boolean;
		printOption3: boolean;
		printOption4: boolean;
		printOption5: boolean;
		printOption6: boolean;
		printOption7: boolean;
		printOption8: boolean;
		printOption9: boolean;
		printOption10: boolean;
	}
	export interface OngekiUserScenario {
		id: number;
		user: number | null;
		scenarioId: number | null;
		playCount: number | null;
	}
	export interface OngekiUserStory {
		id: number;
		user: number | null;
		storyId: number | null;
		jewelCount: number | null;
		lastChapterId: number | null;
		lastPlayMusicId: number | null;
		lastPlayMusicCategory: number | null;
		lastPlayMusicLevel: number | null;
	}
	export interface OngekiUserTechEvent {
		id: number;
		user: number | null;
		eventId: number | null;
		totalTechScore: number | null;
		totalPlatinumScore: number | null;
		techRecordDate: string | null;
		isRankingRewarded: boolean | null;
		isTotalTechNewRecord: boolean | null;
		version: number;
	}
	export interface OngekiUserTradeItem {
		id: number;
		user: number | null;
		chapterId: number | null;
		tradeItemId: number | null;
		tradeCount: number | null;
	}
}
