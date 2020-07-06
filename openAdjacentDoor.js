/**
 * Search the selected token's squares, and a one-square perimeter around them, for any doors. Then, toggle the
 * open/closed state of the first door we find.
 */
(async () => {
	if (!token) return ui.notifications.error(`No token selected!`);

	/** Line intersection http://paulbourke.net/geometry/pointlineplane/ */
	function intersect (x1, y1, x2, y2, x3, y3, x4, y4) {

		// Check if none of the lines are of length 0
		if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) return false;

		const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

		// Lines are parallel
		if (denominator === 0) return false;

		let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
		let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

		// is the intersection along the segments
		if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false;

		// Return a object with the x and y coordinates of the intersection
		let x = x1 + ua * (x2 - x1)
		let y = y1 + ua * (y2 - y1)

		return {x, y}
	}

	function getSquares (token, isPerimeterOnly) {
		const sqPx = canvas.scene.data.grid;

		const xMinPx = token.x - sqPx;
		const yMinPx = token.y - sqPx;

		const xMaxPx = token.x + sqPx;
		const yMaxPx = token.y + sqPx;

		const out = [];
		for (
			let x = xMinPx;
			x < token.x + token.w + sqPx;
			x += sqPx
		) {
			for (
				let y = yMinPx;
				y < token.y + token.h + sqPx;
				y += sqPx
			) {
				const sq = {x, y, w: sqPx, h: sqPx};
				if (isPerimeterOnly) {
					if (x === xMinPx || y === yMinPx || x === xMaxPx || y === yMaxPx) out.push(sq);
				} else {
					out.push(sq);
				}
			}
		}
		return out;
	}

	const squares = getSquares(token);
	const doors = canvas.scene.data.walls.filter(it => it.door === 1);
	for (const square of squares) {
		const lines = [
			[
				[square.x, square.y],
				[square.x + square.w, square.y]
			],
			[
				[square.x + square.w, square.y],
				[square.x + square.w, square.y + square.h]
			],
			[
				[square.x + square.w, square.y + square.h],
				[square.x, square.y + square.h]
			],
			[
				[square.x, square.y + square.h],
				[square.x, square.y]
			],
		];

		for (const door of doors) {
			for (const line of lines) {
				const isIntersect = intersect(
					line[0][0],
					line[0][1],
					line[1][0],
					line[1][1],
					...door.c
				);

				if (isIntersect) {
					await canvas.walls.updateMany([{_id: door._id, ds: door.ds === 1 ? 0 : 1}]);
					return;
				}
			}
		}
	}
	ui.notifications.warn(`No doors found!`);
})();
