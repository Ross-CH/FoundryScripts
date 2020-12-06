(async () => {
	game.user.updateTokenTargets([]);
	game.user.broadcastActivity({targets: game.user.targets.ids});
})();
