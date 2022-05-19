(async () => {
	const _MACRO_SOURCE = "toggleFlankedHomebrew";

	const effectData = {
		disabled: false,
		icon: "icons/commodities/biological/mouth-pincer-brown.webp",
		label: "Flanked!",
		changes: [
			{
				key: "data.attributes.ac.bonus",
				mode: 2,
				value: "-2",
				priority: 4
			},
		],
		flags: {
			core: {
				statusId: "upgrade"
			},
			FoundryScripts: {
				macroSource: _MACRO_SOURCE ,
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
