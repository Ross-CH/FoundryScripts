/**
 * A hard-coded example of how one might roll an attack against a targeted token.
 * NOTE: This is currently non-functional, as it requires GM-level permissions in order to read data/apply damage.
 *   The Foundry targeting system is slated for overhaul, so it may be relevant in future.
 */
(async () => {
	const targetTokens = [...game.user.targets];
	if (targetTokens.length !== 1) {
		ui.notifications.warn(`Please select exactly one token to target!`);
		return;
	}

	const attackRoll = new Roll("1d20 + 7");
	attackRoll.roll();
	attackRoll.toMessage(); // Post the roll to chat

	const targetToken = targetTokens[0];

	const targetAc = targetToken.actor.data.data.attributes.ac.value;

	if (attackRoll.total < targetAc) {
		await ChatMessage.create({
			content: `Attack missed!`,
			user: game.userId,
			type: 1
		});
		return;
	}

	await ChatMessage.create({
		content: `Attack hit!`,
		user: game.userId,
		type: 1
	});

	const damageRoll = new Roll("1d8 + 1d6 + 6");
	damageRoll.roll();
	damageRoll.toMessage(); // Post it to chat

	const nxtHp = Math.max(targetToken.actor.data.data.attributes.hp.value - damageRoll.total, 0);

	const actUpdate = {
		data: {
			attributes: {
				hp: {
					value: nxtHp
				}
			}
		}
	}
	targetToken.actor.update(actUpdate);

	if (nxtHp === 0) {
		const tokenUpdate = {
			overlayEffect: "icons/svg/skull.svg"
		}
		targetToken.update(tokenUpdate);
	} else {
		targetToken.update({}); // refresh any health bars
	}
})();
