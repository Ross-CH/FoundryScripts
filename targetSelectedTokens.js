(async () => {
	game.user.updateTokenTargets([]);
	game.user.updateTokenTargets(canvas.tokens.controlled.map(it => it.id));
	game.user.broadcastActivity({targets: game.user.targets.ids});
})();
