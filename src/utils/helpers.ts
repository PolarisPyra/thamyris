export const getChunithmGrade = (score: number) => {
	if (score >= 1009000) return "SSS+";
	if (score >= 1007500 && score <= 1008999) return "SSS";
	if (score >= 1005000 && score <= 1007499) return "SS+";
	if (score >= 1000000 && score <= 1004999) return "SS";
	if (score >= 990000 && score <= 999999) return "S+";
	if (score >= 975000 && score <= 990000) return "S";
	if (score >= 950000 && score <= 974999) return "AAA";
	if (score >= 925000 && score <= 949999) return "AA";
	if (score >= 900000 && score <= 924999) return "A";
	if (score >= 800000 && score <= 899999) return "BBB";
	if (score >= 700000 && score <= 799999) return "BB";
	if (score >= 600000 && score <= 699999) return "B";
	if (score >= 500000 && score <= 599999) return "C";
	if (score < 500000) return "D";
	return "";
};

export const getDifficultyFromChunithmChart = (chartId: number) => {
	switch (chartId) {
		case 0:
			return "Basic";
		case 1:
			return "Advanced";
		case 2:
			return "Expert";
		case 3:
			return "Master";
		case 4:
			return "Ultima";
		case 5:
			return "Worlds End";
		default:
			return "Unknown";
	}
};

export const getDifficultyFromOngekiChart = (chartId: number) => {
	switch (chartId) {
		case 0:
			return "Basic";
		case 1:
			return "Advanced";
		case 2:
			return "Expert";
		case 3:
			return "Master";
		case 10:
			return "Lunatic";
		default:
			return "Unknown";
	}
};

export const getOngekiGrade = (techScore: number): string => {
	if (techScore >= 1007500) return "SSS+";
	if (techScore >= 1000000) return "SSS";
	if (techScore >= 990000) return "SS";
	if (techScore >= 970000) return "S";
	if (techScore >= 940000) return "AAA";
	if (techScore >= 900000) return "AA";
	if (techScore >= 850000) return "A";
	if (techScore >= 800000) return "BBB";
	if (techScore >= 750000) return "BB";
	if (techScore >= 700000) return "B";
	if (techScore >= 500000) return "C";
	return "D";
};

export const getChunithmClearStatus = (isClear: number): string => {
	if (isClear === 0) return "Failed";
	if (isClear === 1) return "Clear";
	return "";
};

export const getChunithmComboStatus = (isFullCombo: number, isAllJustice: number, score?: number) => {
	if (score && score >= 1010000 && isAllJustice === 1) {
		return "All Justice Critical";
	}
	if (isAllJustice === 1) return "All Justice";
	if (isFullCombo === 1) return "Full Combo";
	return "";
};

export const getOngekiClearStatus = (clearStatus: number): string => {
	if (clearStatus === 2) return "Won";
	if (clearStatus === 1) return "Draw";
	if (clearStatus === 0) return "Loss";
	return "";
};

export const getOngekiComboStatus = (isFullCombo: number, IsAllBreak: number, isFullBell: number): string => {
	if (IsAllBreak === 1 && isFullBell === 1) return "AB + FB";
	if (IsAllBreak === 1) return "AB";
	if (isFullCombo === 1 && isFullBell === 1) return "FC + FB";
	if (isFullBell === 1) return "FB";
	if (isFullCombo === 1) return "FC";
	return "";
};

export function OngekiRating(level: number, score: number): number {
	const internalChartRating = level * 100;

	// Return 0 if score is too low to earn any rating
	if (score < 970000) {
		return 0;
	}

	if (score >= 1007500) {
		return internalChartRating + 200; // +2.00 for SSS+
	} else if (score >= 1000000) {
		return internalChartRating + 150 + Math.floor((score - 1000000) / 150); // +1.50 for SSS, then +0.01 per 150 points
	} else if (score >= 990000) {
		return internalChartRating + 100 + Math.floor((score - 990000) / 200); // +1.00 for SS, then +0.01 per 200 points
	} else if (score >= 970000) {
		return internalChartRating + Math.floor((score - 970000) / 200); // ±0 at 970000, then +0.01 per 200 points
	}

	return 0; // Fallback return 0
}
export function OngekiGekForceRating(
	level: number,
	score: number,
	isFullCombo: number,
	isAllBreake: number,
	isFullBell: number
): number {
	const internalChartRating = level * 1000;
	let rating = 0;

	const fullCombo = isFullCombo === 1;
	const allBreake = isAllBreake === 1;
	const fullBell = isFullBell === 1;

	if (score < 500000) {
		return 0;
	} else if (score < 800000) {
		rating = internalChartRating + ((level - 6) * (score - 500000)) / 300000;
	} else if (score < 900000) {
		rating = internalChartRating + (level - 6) + (2 * (score - 800000)) / 100000;
	} else if (score < 970000) {
		rating = internalChartRating + (level - 4) + (4 * (score - 900000)) / 70000;
	} else if (score < 990000) {
		rating = internalChartRating + level + (0.75 * (score - 970000)) / 20000;
	} else if (score < 1000000) {
		rating = internalChartRating + (level + 0.75) + (0.5 * (score - 990000)) / 10000;
	} else if (score < 1007500) {
		rating = internalChartRating + (level + 1.25) + (0.5 * (score - 1000000)) / 7500;
	} else if (score <= 1010000) {
		rating = internalChartRating + (level + 1.75) + (0.25 * (score - 1007500)) / 2500;
	} else {
		return 0;
	}

	// Apply bonuses
	if (score === 1010000) {
		rating += 0.35; // AB+
	} else if (allBreake) {
		rating += 0.3;
	} else if (fullCombo) {
		rating += 0.1;
	}

	if (fullBell) {
		rating += 0.05;
	}
	if (score >= 1007500) {
		rating += 0.3; // SSS+
	} else if (score >= 1000000) {
		rating += 0.2; // SSS
	} else if (score >= 990000) {
		rating += 0.1; // SS
	}

	return rating;
}

export function ChunitmRating(level: number, score: number): number {
	if (score >= 1009000) {
		return level * 100 + 215;
	} else if (score >= 1007500) {
		return level * 100 + 200 + (score - 1007500) / 100;
	} else if (score >= 1005000) {
		return level * 100 + 150 + (score - 1005000) / 50;
	} else if (score >= 1000000) {
		return level * 100 + 100 + (score - 1000000) / 100;
	} else if (score >= 975000) {
		return level * 100 + (score - 975000) / 250;
	} else if (score >= 925000) {
		return level * 100 - 300 + ((score - 925000) * 3) / 500;
	} else if (score >= 900000) {
		return level * 100 - 500 + ((score - 900000) * 4) / 500;
	} else if (score >= 800000) {
		return (level * 100 - 500) / 2 + ((score - 800000) * ((level - 500) / 2)) / 100000;
	} else {
		return 0;
	}
}
