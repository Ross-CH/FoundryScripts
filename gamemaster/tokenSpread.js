/**
 * Spreads tokens from a given folder onto the canvas.
 */
(async () => {
	const PADDING = 1; // Offset by 1 to avoid jamming things in the corners

	const actors = [...game.folders.getName("Tokens").contents].sort((a, b) => a.name.localeCompare(b.name, "en", {sensitivity: "base"}));

	let col = PADDING, row = PADDING;
	let rowMaxHeight = 0;
	const {width: sceneWidth, height: sceneHeight} = canvas.scene;
	const cols = sceneWidth / canvas.grid.size;
	const rows = sceneHeight / canvas.grid.size; // (Ignored, for now; assume a sufficiently large scene)

	for (const act of actors) {
		const tokenSize = act.prototypeToken.width; // (Assumes square token)
		const tokenScale = act.prototypeToken.texture.scaleX; // (Assumes square token)

		const spaceRequired = Math.ceil(tokenSize * tokenScale);

		if ((col + spaceRequired) > cols) {
			row += rowMaxHeight;
			col = PADDING;
			rowMaxHeight = 0;
		}

		const colRowOffset = Math.floor((spaceRequired - tokenSize) / 2);

		const x = (col + colRowOffset) * canvas.grid.size;
		const y = (row + colRowOffset) * canvas.grid.size;

		const td = await act.getTokenDocument({x, y});

		await td.constructor.create(td, {parent: canvas.scene});

		col += spaceRequired
		rowMaxHeight = Math.max(rowMaxHeight, spaceRequired);
	}
})();
