/**
 * A simple rage-toggle macro.
 * TODO(Future) allow this to toggle resistances to appropriate damage types + advantage on appropriate checks/etc
 *   if/when Foundry's sheet supports this.
 */
(async () => {
	if (canvas.tokens.controlled.length !== 1) return ui.notifications.warn(`Please select exactly one token!`);

	const actor = canvas.tokens.controlled[0].actor;
	if (!actor) return ui.notifications.warn(`Please select an actor with a token!`);

	const classItems = actor.data.items.filter(it => it.type === "class")
	if (!classItems.length) return ui.notifications.warn(`Actor has no class!`);

	const barbarianClassItems = classItems.filter(it => it.name.toLowerCase() === "barbarian");
	if (!barbarianClassItems.length) return ui.notifications.warn(`Actor has no Barbarian class!`);

	if (barbarianClassItems.length > 1) return ui.notifications.warn(`Actor has multiple Barbarian classes!`);

	const classItem = barbarianClassItems[0];

	const rageDamage = Math.max(2, Math.ceil((classItem.data.levels - 1) / 7) + 1);

	const curDamageBonus =  actor.data.data?.bonuses?.mwak?.damage;
	const curRageDamage = actor.data.flags.wmgsRageDamage;

	const actorUpdate = {
		data: {},
		flags: {},
	};

	if (curRageDamage) {
		const nxtDamageBonus = curDamageBonus ? curDamageBonus.replace(curRageDamage, "") : "";

		if (!curDamageBonus || nxtDamageBonus.length === curDamageBonus.length) {
			ui.notifications.warn(`Could not find rage bonus string "${curRageDamage}" to remove!`);
		}

		((actorUpdate.data.bonuses = {}).mwak = {}).damage = nxtDamageBonus;
		actorUpdate.flags.wmgsRageDamage = null;

		ChatMessage.create({
			content: `<div style="font-style: italic">${actor.name} calms the fuck down.</div>`,
			user: game.userId,
			type: 1,
			sound: "https://www.myinstants.com/media/sounds/oh-shit-iam-sorry.mp3"
		});
	} else {
		const strRageDamage = `+${rageDamage}`;
		((actorUpdate.data.bonuses = {}).mwak = {}).damage = `${curDamageBonus || ""}${strRageDamage}`;
		actorUpdate.flags.wmgsRageDamage = strRageDamage;

		ChatMessage.create({
			content: `<div style="color: red; font-weight: bold; font-size: 120%;">${actor.name.toUpperCase()} FLIES INTO A RAGE!</div>`,
			user: game.userId,
			type: 1,
			sound: "https://www.myinstants.com/media/sounds/rip-ears.mp3"
		});
	}

	await actor.update(actorUpdate);
})();
