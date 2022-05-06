(async () => {
	const _MACRO_SOURCE = "toggleFlankingHomebrew";

	const effectData = {
		disabled: false,
		icon: "icons/commodities/biological/mouth-pincer-brown.webp",
		label: "Flanking",
		changes: [
			{
				key: "data.bonuses.mwak.attack",
				mode: 2,
				value: "+2",
				priority: 4
			},
		],
		flags: {
			core: {
				statusId: "upgrade"
			},
			FoundryScripts: {
				macroSource: "toggleFlankingHomebrew",
			},
		},
	};

	for (const token of canvas.tokens.controlled) {
		const existing = token.actor.effects.filter(it => it?.data?.flags?.FoundryScripts?.macroSource === _MACRO_SOURCE);
		if (existing.length) {
			await token.actor.deleteEmbeddedDocuments("ActiveEffect", existing.map(it => it.id));
			continue;
		}
		await token.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
	}
})()
