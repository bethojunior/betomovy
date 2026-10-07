class Session {
	static getLocal(name: string) {
		const local = localStorage.getItem(name);

		if (local) {
			try {
				return JSON.parse(local);
			} catch {
				return [];
			}
		}
		return [];
	}

	static setLocal(name: string, value: string): void {
		return localStorage.setItem(name, value);
	}

	static deleteLocal(name: string): void {
		return localStorage.removeItem(name);
	}

	static getValueInSessionLocal(
		id: string,
		attribute: number,
	): string[] | null {
		const session = Session.getLocal(id);

		if (!session) {
			return null;
		}
		if (Array.isArray(session)) {
			return session.map((item) => {
				return item[attribute];
			});
		}
		return session[attribute];
	}

	static hasCitySelected(): boolean {
		const citySelected = Session.getLocal("citySelected");
		return !Array.isArray(citySelected) && citySelected !== null && typeof citySelected === 'object' && Object.keys(citySelected).length > 0;
	}
}

export default Session;
