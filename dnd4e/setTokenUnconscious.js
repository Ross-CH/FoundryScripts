(async () => {
	const effectData = {
		disabled: false,
		icon: "systems/dnd4e/icons/statusEffects/unconscious.svg",
		label: "Unconscious",
		flags: {
			core: {
				statusId: "unconscious",
				overlay: true
			},
		},
	};

	for (const token of canvas.tokens.controlled) {
		await token.actor.createEmbeddedDocuments("ActiveEffect", [effectData])
	}
})()
