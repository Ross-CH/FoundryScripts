/**
 * Hide all drawings in the current scene.
 * For Foundry v9.
 */
(async () => {
	for (const drawing of canvas.scene.drawings.contents) {
		await drawing.update({
			fillAlpha: 0,
			strokeAlpha: 0,
		})
	}
})();

/**
 * Show all drawings in the current scene.
 * For Foundry v9.
 */
(async () => {
	for (const drawing of canvas.scene.drawings.contents) {
		await drawing.update({
			fillAlpha: 0.4,
			strokeAlpha: 0.8,
		})
	}
})()
