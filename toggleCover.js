(async () => {
	const _MACRO_SOURCE = "toggleCover";
	const _COVER_HALF = 1;
	const _COVER_THREE_QUARTERS = 2;

	const getEffectData = (curCover = 0) => {
		return  {
			disabled: false,
			icon: curCover === _COVER_HALF ? "icons/environment/settlement/city-wall.webp" : "icons/environment/traps/spiked-wall.webp",
			label: curCover === _COVER_HALF ? "Three-Quarters Cover" : "Half Cover",
			changes: [
				{
					key: "data.attributes.ac.bonus",
					mode: 2,
					value: curCover === _COVER_HALF ? "5" : "2",
					priority: 4
				},
			],
			flags: {
				core: {
					statusId: "upgrade"
				},
				FoundryScripts: {
					macroSource: _MACRO_SOURCE,
					cover: curCover + 1
				},
			},
		};
	};

	for (const token of canvas.tokens.controlled) {
		const existing = token.actor.effects.filter(it => it?.data?.flags?.FoundryScripts?.macroSource === _MACRO_SOURCE);
		await token.actor.deleteEmbeddedDocuments("ActiveEffect", existing.map(it => it.id));

		const maxExisting = Math.max(0, ...existing.map(it => it?.data?.flags?.FoundryScripts?.cover));

		if (maxExisting === _COVER_THREE_QUARTERS) continue;
		await token.actor.createEmbeddedDocuments("ActiveEffect", [getEffectData(maxExisting)]);
	}
})();
