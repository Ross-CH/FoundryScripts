/**
 * Move the contents of a scene by a set amount; useful for repositioning everything if you realise you've gone beyond
 * the scene boundaries/have resized the scene and need to centre everything.
 */
(async () => {
	// Adjust to taste
	const movementAmountX = 1750;
	const movementAmountY = 1750;

	const toMoves = [
		canvas.tokens.placeables,
		canvas.tiles.placeables,
		canvas.notes.placeables,
		canvas.lighting.placeables,
	];

	for (const toMove of toMoves) {
		for (const plc of toMove) {
			await plc.update({x: plc.x + movementAmountX, y: plc.y + movementAmountY});
		}
	}

	// Note that this assumes walls are single straight lines, which is correct as of 2020-11-27 (Foundry v0.7.x)
	//   If e.g. curved walls are introduced in future, this will have to be adjusted.
	for (const wall of canvas.walls.placeables) {
		const [px, py, qx, qy] = wall.data.c;
		await wall.update({c: [px + movementAmountX, py + movementAmountY, qx + movementAmountX, qy + movementAmountY]})
	}
})().then(() => console.log("Done!"));

