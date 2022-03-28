/**
 * Have a set of lights (which should have limited light angles in order for this to have any effect)
 * follow a token around.
 */
(async () => {
	const X = 0;
	const Y = 1;

	const TOKEN_ID = "Y2rLU7n9DSnj8SjV";

	const LIGHT_IDS = [
		"F718FamiyaCgVeSO",
		"A0o00bTFAiDOaVfG",
		"kJgEQf3u1PnPsp7m",
	];

	if (window.__spotlight_idHook != null) {
		ui.notifications.info("Disabled spotlights.")
		Hooks.off("updateToken", window.__spotlight_idHook);
		window.__spotlight_idHook = null;
		return;
	}

	ui.notifications.info("Enabled spotlights!")

	window.__spotlight_idHook = Hooks.on("updateToken", async (docToken) => {
		if (docToken.id !== TOKEN_ID) {
			return;
		}

		const tokenDemon = docToken.object;

		const centreDemon = [tokenDemon.center.x, tokenDemon.center.y];
		const szGrid = canvas.scene.data.grid;

		const updates = [];

		for (const lightId of LIGHT_IDS) {
			const light = canvas.lighting.placeables.find(it => it.id === lightId);
			if (!light) continue;

			const centreLight = [light.x, light.y];

			const centreDemonScaled = centreDemon.map(it => it / szGrid);
			const centreLightScaled = centreLight.map(it => it / szGrid);

			const bright = Math.sqrt(
				Math.pow(centreLightScaled[X] - centreDemonScaled[X], 2)
				+ Math.pow(centreLightScaled[Y] - centreDemonScaled[Y], 2),
			);

			const rotation = (Math.atan2(
				centreLight[Y] - centreDemon[Y],
				centreLight[X] - centreDemon[X],
			) * 180 / Math.PI) + 90;

			const update = {
				_id: light.id,
				config: {
					bright,
				},
				rotation,
			};

			updates.push(update)
		}

		await canvas.scene.updateEmbeddedDocuments("AmbientLight", updates);
	});
})()
