export const getGrade = (score: number) => {
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
