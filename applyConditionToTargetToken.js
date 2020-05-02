(async () => {
	const targetTokens = [...game.user.targets];
	if (targetTokens.length !== 1) {
		ui.notifications.warn(`Please select exactly one token to target!`);
		return;
	}

	const targetToken = targetTokens[0];

	const effectsSet = new Set([...targetToken.data.effects || []]);
	effectsSet.add("icons/svg/target.svg");
	const effects = [...effectsSet];

	const tokenUpdate = {effects}
	targetToken.update(tokenUpdate);
})();
