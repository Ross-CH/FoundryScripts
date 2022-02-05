/**
 * Spawn a light to white out the scene, then gradually reduce the intensity to simulate a "flashbang" effect.
 */
(async () => {
	const TICK = 50;
	const DELAY_INITIAL = 2500;
	const lightPerTick = 0.025;

	const canvasW = canvas.scene.data.width + (canvas.scene.data.width * canvas.scene.data.padding * 2);
	const canvasH = canvas.scene.data.height + (canvas.scene.data.height * canvas.scene.data.padding * 2);

	const initialData = {
		x: canvasW / 2,
		y: canvasH / 2,
		config: {
			bright: Math.max(canvasW, canvasH) / canvas.scene.data.grid,
			dim: 0,
			coloration: 0,
			color: "#ffffff",
			alpha: 1,
		},
	};

	const [docLight] = await canvas.scene.createEmbeddedDocuments("AmbientLight", [initialData]);

	const light = docLight.object;

	await MiscUtil.pDelay(DELAY_INITIAL);

	while (light.data.config.alpha > 0) {
		await MiscUtil.pDelay(TICK);
		await canvas.scene.updateEmbeddedDocuments("AmbientLight", [
			{
				_id: light.id,
				config: {
					alpha: Math.max(0, light.data.config.alpha - lightPerTick),
				}
			}
		]);
	}

	await canvas.scene.deleteEmbeddedDocuments("AmbientLight", [light.id]);
})();
