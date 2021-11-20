(async () => {
	for (const drawing of canvas.scene.drawings.contents) {
		await drawing.update({
			fillAlpha: 0,
			strokeAlpha: 0,
		})
	}
})()
