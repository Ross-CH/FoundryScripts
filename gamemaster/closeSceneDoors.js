/**
 * Close all doors in the scene.
 * For Foundry v9.
 */
(async () => {
	await canvas.scene.updateEmbeddedDocuments("Wall", canvas.scene.data.walls.map(w => {
		return {_id: w.id, ds: w.data.ds === 1 ? 0 : w.data.ds};
	}));
})();
