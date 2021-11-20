(async () => {
	for (const drawing of canvas.scene.drawings.contents) {
		await drawing.update({
			fillAlpha: 0.4,
			strokeAlpha: 0.8,
		})
	}
})()
