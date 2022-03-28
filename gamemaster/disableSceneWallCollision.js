/**
 * Set all walls in the current scene to allow movement.
 * For Foundry v9.
 */
canvas.scene.updateEmbeddedDocuments("Wall", canvas.scene.data.walls.map(w => {
	return {_id: w.id, move: 0};
}));
