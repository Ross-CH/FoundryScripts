/**
 * Set all doors in the current scene to allow "Limited" sound.
 */
(async () => {
	// 0 = wall; 1 = door; 2 = secret door
	// See: `CONST.WALL_DOOR_TYPES`
	const doorWalls = canvas.scene.data.walls.filter(it => it.data.door);

	canvas.scene.updateEmbeddedDocuments(
		"Wall",
		doorWalls.map(w => ({
			_id: w.id,
			// 20 = block; 10 = limited; 0 = allow
			// See: `CONST.WALL_SENSE_TYPES`
			sound: 10,
		})),
	);
})();
