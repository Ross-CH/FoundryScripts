/**
 * An implementation of the "half the number of faces, double the number of dice" hit dice rule.
 * Usage:
 *  - Select token
 *  - Activate macro
 */
(async () => {
	if (canvas.tokens.controlled.length !== 1) return ui.notifications.warn(`Please select exactly one token!`);

	const actor = canvas.tokens.controlled[0].actor;
	if (!actor) return ui.notifications.warn(`Please select an actor with a token!`);

	const classItems = actor.data.items.filter(it => it.type === "class")
	if (!classItems.length) return ui.notifications.warn(`Actor has no class!`);

	// TODO(Future): implement this if required. Will require some user prompt to allow them to pick the class--see FVTT's `Dialogue` class.
	if (classItems.length > 1) return ui.notifications.warn(`Actor has multiple classes! This is not (yet) supported.`);

	const classItem = classItems[0];

	if (classItem.data.hitDiceUsed >= classItem.data.levels) return ui.notifications.warn(`You have no remaining hit dice to spend!`);

	const classItemUpdate = {
		_id: classItem._id,
		data: {
			hitDiceUsed: classItem.data.hitDiceUsed + 1,
		},
	};

	await actor.updateEmbeddedEntity("OwnedItem", classItemUpdate);

	const diceFaces = Number(classItem.data.hitDice.replace("d", ""));

	const hitDieRoll = new Roll(`2d${diceFaces / 2} + ${actor.data.data.abilities.con.mod}`);
	hitDieRoll.roll();
	hitDieRoll.toMessage(); // Post the roll to chat

	const actorUpdate = {
		data: {
			attributes: {
				hp: {
					value: Math.clamped(
						actor.data.data.attributes.hp.value + hitDieRoll.total,
						actor.data.data.attributes.hp.min,
						actor.data.data.attributes.hp.max
					)
				},
			},
		},
	};

	await actor.update(actorUpdate);
})();
