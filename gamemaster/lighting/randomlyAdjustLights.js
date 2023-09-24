/**
 * Randomly adjust lights with a specific set of attributes.
 */
(async () => {
	const lights = canvas.scene.lights.contents.filter(l => l.config.angle === 180 && l.rotation === 180 && l.config.animation.type === "torch")

	const updates = lights.map(it => ({
		_id: it.id,
		...{
			config: {
				bright: 0.15 + (Math.round(Math.random() * 0.3 * 100) / 100),
				animation: {
					speed: 5 + Math.round(Math.random() * 5)
				},
				color: RollerUtil.rollOnArray([
					"#c8e4ff",
					"#ffd500",
					"#ffd500",
					"#ffd500",
					"#ffab4c",
					"#ff2e2e",
				])
			}
		},
	}));

	await canvas.scene.updateEmbeddedDocuments("AmbientLight", updates);
})();
