/**
 * === Scourge Aasimar: Radiant Consumption ===
 *
 * @see aasimarRadiantConsumptionPassive.js
 *
 * Press this macro before using your damaging attack/spell; the extra radiant will be applied, and then removed after
 * you roll damage.
 */

const cpy = o => JSON.parse(JSON.stringify(o));
const getLvl = () => actor.items.filter(it => it.type === "class").map(it => it.data.data.levels).reduce((a, b) => a + b, 0);
const isAffectedItem = item => (item.data.type === "spell" || item.data.type === "weapon") && item.data.data?.actionType !== "heal" && item.data.data?.damage?.parts?.length;

(async () => {
	if (!actor) return ui.notifications.error("Please select a token!");

	window._asmrHooksActive = window._asmrHooksActive || {};

	const doCleanupHooks = () => {
		const oldUid = actor.getFlag("minor-qol", "asmr-hookIdActive");
		if (oldUid) {
			const {hkCreateChatMessage} = window._asmrHooksActive[oldUid] || {};
			hkCreateChatMessage && Hooks.off("createChatMessage", hkCreateChatMessage);
		}
	};

	const doRemoveExtraRadiant = async () => {
		if (!actor.getFlag("minor-qol", "asmr-extraDamage")) return;
		await ChatMessage.create({content: `${actor.name}'s attacks are no longer infused with radiance.`, user: game.userId, type: 1});
		for (const item of actor.items) {
			if (!isAffectedItem(item)) continue;
			const ix = item.data.data.damage.parts.findIndex(([amount, type]) => `${amount}` === actor.getFlag("minor-qol", "asmr-extraDamage") && type === "radiant");
			if (!~ix) continue;
			await item.update({"data.damage.parts": cpy(item.data.data.damage.parts).filter((_, i) => i !== ix)});
		}
		await actor.unsetFlag("minor-qol", "asmr-extraDamage");
	};

	doCleanupHooks();

	// If the user presses again without using the damage, remove it
	if (actor.getFlag("minor-qol", "asmr-extraDamage")) return doRemoveExtraRadiant();

	const uid = Date.now();
	await actor.setFlag("minor-qol", "asmr-hookIdActive", uid);

	const hkCreateChatMessage = (message, meta) => {
		if (meta.rollMode !== "roll") return;
		if (message.user.id !== game.userId) return;
		// Remove extra radiant after we roll damage
		if (message.data.flavor.includes("Damage Roll")) doRemoveExtraRadiant();
	};

	Hooks.on("createChatMessage", hkCreateChatMessage);
	Object.assign(window._asmrHooksActive, {[uid]: {hkCreateChatMessage}});

	await doRemoveExtraRadiant();
	await ChatMessage.create({content: `${actor.name} next damage roll is infused with radiance!`, user: game.userId, type: 1});

	// Add new damage
	const damageAmount = getLvl();
	await actor.setFlag("minor-qol", "asmr-extraDamage", `${damageAmount}`);
	for (const item of actor.items) {
		if (!isAffectedItem(item)) continue;
		await item.update({"data.damage.parts": [...cpy(item.data.data.damage.parts), [damageAmount, "radiant"]]});
	}
})();
