(async () => {
	game.user.targets.forEach(token => {
		const effects = [...token.data.effects || []].filter(it => it !== "icons/svg/target.svg");
		const tokenUpdate = {effects}
		token.update(tokenUpdate);
	})
})();
