(async () => {
	game.user.updateTokenTargets([]);
	game.user.updateTokenTargets(canvas.tokens.controlled.map(it => it.id));
})();
