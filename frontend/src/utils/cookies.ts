export function setCookie(name: string, value: string, days = 180) {
	try {
		const expires = new Date(Date.now() + days * 864e5).toUTCString();
		document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
	} catch {}
}

export function getCookie(name: string): string | undefined {
	try {
		const cookies = document.cookie ? document.cookie.split('; ') : [];
		for (const c of cookies) {
			const [k, ...rest] = c.split('=');
			if (decodeURIComponent(k) === name) return decodeURIComponent(rest.join('='));
		}
		return undefined;
	} catch {
		return undefined;
	}
} 