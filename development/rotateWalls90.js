/**
 * Rotate selected walls by 90 degrees.
 */
(async () => {
	const [xCenter, yCenter] = canvas.walls.controlled
		.reduce(([xAccum, yAccum], wall) => {
			const [x0, y0, x1, y1] = wall.document.c;
			return [
				xAccum + x0 + ((x1 - x0) / 2),
				yAccum + y0 + ((y1 - y0) / 2),
			];
		}, [0, 0])
		.map(pt => pt / canvas.walls.controlled.length);

	const walls = canvas.walls
		.controlled.map(wall => {
			const [x0, y0, x1, y1] = wall.document.c;

			const mid_offset_0 = x0 - xCenter;
			const mid_offset_1 = y0 - yCenter;
			const mid_offset_2 = x1 - xCenter;
			const mid_offset_3 = y1 - yCenter;

			return {
				_id: wall.id,
				c: [
					xCenter - mid_offset_1,
					yCenter + mid_offset_0,
					xCenter - mid_offset_3,
					yCenter + mid_offset_2,
				]
			};
		});

	await canvas.scene.updateEmbeddedDocuments("Wall", walls);
})();
