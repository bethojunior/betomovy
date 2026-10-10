class Session {
	static getLocal(name: string) {
		try {
			const local = localStorage.getItem(name);
			if (!local || local === "undefined" || local === "null" || local.trim() === "") {
				return null;
			}
			return JSON.parse(local);
		} catch {
			try {
				localStorage.removeItem(name);
			} catch {}
			return null;
		}
	}

	static setLocal(name: string, value: any): void {
		try {
			if (value === undefined || value === null || value === "undefined" || value === "null") {
				localStorage.removeItem(name);
				return;
			}
			const stringVal = typeof value === "string" ? value : JSON.stringify(value);
			if (stringVal === "undefined" || stringVal === "null") {
				localStorage.removeItem(name);
				return;
			}
			localStorage.setItem(name, stringVal);
		} catch {}
	}

	static deleteLocal(name: string): void {
		try {
			localStorage.removeItem(name);
		} catch {}
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
		return session[attribute] ?? null;
	}

	static hasCitySelected(): boolean {
		const citySelected = Session.getLocal("citySelected");
		if (!citySelected || typeof citySelected !== "object" || Array.isArray(citySelected)) {
			return false;
		}
		return !!(citySelected.cityId || citySelected.id || citySelected.nome);
	}
}

export default Session;
