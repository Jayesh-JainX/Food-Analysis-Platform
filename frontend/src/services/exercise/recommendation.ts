import { getCookie, setCookie } from "@/utils/cookies";

type Category =
	| "home"
	| "gym"
	| "yoga"
	| "meditation"
	| "strength"
	| "cardio"
	| "mobility"
	| "pilates"
	| "warmup"
	| "cooldown"
	| "prenatal"
	| "kids"
	| "other";

export type Language = "any" | "en" | "hi" | "mr" | "bn" | "ta" | "te" | "kn" | "ml" | "gu" | "pa";

interface ExercisePrefs {
	preferredCategory?: Category;
	preferredMaxMinutes?: number;
	preferredMinMinutes?: number;
	preferredLanguage?: Language;
	playsByCategory?: Record<Category, number>;
	averageDurationMin?: number;
	watchedVideoIds?: string[];
}

function storageKey(userId?: string) {
	return `wal.exercise.prefs.${userId || "anon"}`;
}

export function loadExercisePrefs(userId?: string): ExercisePrefs {
	try {
		const raw = localStorage.getItem(storageKey(userId));
		const base = raw ? (JSON.parse(raw) as ExercisePrefs) : {};
		const cookieLang = (getCookie("wal.exercise.lang") as Language | undefined) || undefined;
		if (cookieLang && !base.preferredLanguage) base.preferredLanguage = cookieLang;
		return base;
	} catch {
		return {};
	}
}

export function saveExercisePrefs(userId: string | undefined, prefs: ExercisePrefs) {
	try {
		localStorage.setItem(storageKey(userId), JSON.stringify(prefs));
		if (prefs.preferredLanguage) setCookie("wal.exercise.lang", prefs.preferredLanguage);
	} catch {}
}

export function recordPlay(
	userId: string | undefined,
	category: Category,
	durationMin?: number,
	videoId?: string,
	language?: Language
) {
	const prefs = loadExercisePrefs(userId);
	prefs.playsByCategory =
		prefs.playsByCategory || {
			home: 0,
			gym: 0,
			yoga: 0,
			meditation: 0,
			strength: 0,
			cardio: 0,
			mobility: 0,
			pilates: 0,
			warmup: 0,
			cooldown: 0,
			prenatal: 0,
			kids: 0,
			other: 0,
		};
	prefs.playsByCategory[category] = (prefs.playsByCategory[category] || 0) + 1;
	
	// Record average duration for analytics but don't override user's preferred range
	if (durationMin && durationMin > 0) {
		const prev = prefs.averageDurationMin || durationMin;
		prefs.averageDurationMin = Math.round((prev * 0.7 + durationMin * 0.3) * 10) / 10;
		// REMOVED: prefs.preferredMaxMinutes = prefs.averageDurationMin;
		// Don't automatically change user's preferred range based on video duration
	}
	
	if (videoId) {
		prefs.watchedVideoIds = Array.from(new Set([...(prefs.watchedVideoIds || []), videoId])).slice(-200);
	}
	if (language && language !== "any") {
		prefs.preferredLanguage = language;
	}
	const entries = Object.entries(prefs.playsByCategory || {}) as [Category, number][];
	entries.sort((a, b) => b[1] - a[1]);
	prefs.preferredCategory = entries[0]?.[0] || prefs.preferredCategory || "home";
	saveExercisePrefs(userId, prefs);
}

export function getPreferredCategory(userId?: string): Category {
	const prefs = loadExercisePrefs(userId);
	return (prefs.preferredCategory as Category) || "home";
}

export function getPreferredMaxMinutes(userId?: string): number {
	const prefs = loadExercisePrefs(userId);
	return prefs.preferredMaxMinutes ?? 30;
}

export function getPreferredMinMinutes(userId?: string): number {
	const prefs = loadExercisePrefs(userId);
	return prefs.preferredMinMinutes ?? 0;
}

export function setPreferredRange(
	userId: string | undefined,
	minMinutes: number,
	maxMinutes: number
) {
	const prefs = loadExercisePrefs(userId);
	prefs.preferredMinMinutes = minMinutes;
	prefs.preferredMaxMinutes = maxMinutes;
	saveExercisePrefs(userId, prefs);
}

export function getPreferredLanguage(userId?: string): Language {
	const prefs = loadExercisePrefs(userId);
	return prefs.preferredLanguage || (getCookie("wal.exercise.lang") as Language) || "en";
}

export function setPreferredLanguage(userId: string | undefined, lang: Language) {
	const prefs = loadExercisePrefs(userId);
	prefs.preferredLanguage = lang;
	saveExercisePrefs(userId, prefs);
}

export function getWatchedIds(userId?: string): Set<string> {
	const prefs = loadExercisePrefs(userId);
	return new Set(prefs.watchedVideoIds || []);
} 