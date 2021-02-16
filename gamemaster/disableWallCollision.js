/**
 * Set all walls in the current scene to allow movement.
 */
canvas.walls.updateMany(canvas.scene.data.walls.map(w => ({_id: w._id, move: 0})));
