export async function registerServiceWorker() {
	if (!('serviceWorker' in navigator)) return null;
	try {
		const registration = await navigator.serviceWorker.register('/sw.js');
		return registration;
	} catch (err) {
		console.error('Service worker registration failed', err);
		return null;
	}
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
	if (!('Notification' in window)) return 'denied';
	try {
		const permission = await Notification.requestPermission();
		return permission;
	} catch (err) {
		console.error('Notification permission request failed', err);
		return Notification.permission;
	}
}

export async function showDeviceNotification(
	title: string,
	options?: NotificationOptions & { url?: string; tag?: string }
) {
	try {
		const registration = await navigator.serviceWorker.getRegistration();
		if (registration && Notification.permission === 'granted') {
			const { url, ...rest } = options || {} as any;
			await registration.active?.postMessage({
				type: 'SHOW_NOTIFICATION',
				payload: {
					title,
					body: rest.body,
					icon: rest.icon,
					url,
					tag: rest.tag,
				},
			});
		} else if ('Notification' in window && Notification.permission === 'granted') {
			new Notification(title, options);
		}
	} catch (err) {
		console.error('Failed to show device notification', err);
	}
} 