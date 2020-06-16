/**
 * === Scourge Aasimar: Radiant Consumption ===
 *
 * * @see aasimarRadiantConsumptionActive.js
 *
 * Requires "MinorQOL" module, with the following modification to expose `applyTokenDamage`:
 * (L116)
 * ```
 * window.MinorQOL = {
 * 	 checkSaves: checkSaves,
 * ```
 * to
 * ```
 * window.MinorQOL = {
 * 	 checkSaves: checkSaves,
 * 	 applyTokenDamage: applyTokenDamage,
 * ```
 */

const cpy = o => JSON.parse(JSON.stringify(o));
const getLvl = () => actor.items.filter(it => it.type === "class").map(it => it.data.data.levels).reduce((a, b) => a + b, 0);

/** Convert a token to its squares, as centred points. */
const getSquares = token => {
	const wPx = token.data.width * canvas.scene.data.grid;
	const hPx = token.data.height * canvas.scene.data.grid;
	const out = [];
	for (let x = token.x; x < token.x + wPx; x += canvas.scene.data.grid) {
		for (let y = token.y; y < token.y + hPx; y += canvas.scene.data.grid) {
			out.push({x: x + (canvas.scene.data.grid / 2), y: y + (canvas.scene.data.grid / 2)});
		}
	}
	return out;
};

(async () => {
	if (!actor) return ui.notifications.error("Please select a token!");

	window._asmrHooksPassive = window._asmrHooksPassive || {};

	const doCleanupHooks = () => {
		const oldUid = actor.getFlag("minor-qol", "asmr-hookId");
		if (oldUid) {
			const {hkDeleteCombat, hkUpdateCombat} = window._asmrHooksPassive[oldUid] || {};
			hkDeleteCombat && Hooks.off("deleteCombat", hkDeleteCombat);
			hkUpdateCombat && Hooks.off("updateCombat", hkUpdateCombat);
		}
	};

	const doDeactivate = async () => {
		await ChatMessage.create({content: `${actor.name} stops radiating.`, user: game.userId, type: 1});

		await actor.unsetFlag("minor-qol", "asmr-turnsRemaining");

		if (actor.getFlag("minor-qol", "asmr-light")) {
			const saved = actor.getFlag("minor-qol", "asmr-light");
			await token.update({brightLight: saved.brightLight, dimLight: saved.dimLight, lightColor: saved.lightColor});
			await actor.unsetFlag("minor-qol", "asmr-light");
		}
	};

	doCleanupHooks();
	if ((actor.getFlag("minor-qol", "asmr-turnsRemaining") || 0) > 0) {
		await doDeactivate();
		return;
	}

	await ChatMessage.create({content: `${actor.name} radiates...`, user: game.userId, type: 1});

	const uid = Date.now();
	await actor.setFlag("minor-qol", "asmr-hookId", uid);
	await actor.setFlag("minor-qol", "asmr-turnsRemaining", 10);

	let prevCombatant = null;
	const hkDeleteCombat = () => prevCombatant = null;
	const hkUpdateCombat = (combat, updateData, updateOpts) => {
		if (!updateOpts.diff) return;

		const activeCombatantId = ui.combat.combat?.current?.tokenId;
		if (prevCombatant === token.id) doTurnEnd();
		prevCombatant = activeCombatantId;
	};

	Hooks.on("deleteCombat", hkDeleteCombat);
	Hooks.on("updateCombat", hkUpdateCombat);
	Object.assign(window._asmrHooksPassive, {[uid]: {hkDeleteCombat, hkUpdateCombat}});


	/** Burn surrounding tokens on turn end. */
	const doTurnEnd = async () => {
		const turnsRemaining = actor.getFlag("minor-qol", "asmr-turnsRemaining") || 0;
		if (turnsRemaining <= 0) return;

		await actor.setFlag("minor-qol", "asmr-turnsRemaining", turnsRemaining - 1);

		const damageAmount = Math.ceil(getLvl() / 2);
		await ChatMessage.create({content: `${actor.name} sears for ${damageAmount} radiant damage! (${turnsRemaining - 1} turn${turnsRemaining - 1 === 1 ? "" : "s"} remain)`, user: game.userId, type: 1});
		if (damageAmount) {
			const sqPx = canvas.scene.data.grid / canvas.scene.data.gridDistance;
			const aoe = new PIXI.Circle(token.center.x, token.center.y, Math.ceil((sqPx * 10) + (token.data.width * canvas.scene.data.grid / 2)));
			const targets = canvas.tokens.placeables.filter(it => it.actor && getSquares(it).some(sq => aoe.contains(sq.x, sq.y)));
			MinorQOL.applyTokenDamage([{damage: damageAmount, type: "radiant"}], damageAmount, new Set(targets), 0, new Set());
		}

		if (turnsRemaining - 1 === 0) {
			doCleanupHooks();
			await doDeactivate();
		}
	};

	// Lighting
	if (!actor.getFlag("minor-qol", "asmr-light")) {
		await actor.setFlag("minor-qol", "asmr-light", cpy(token.data));
		await token.update({brightLight: Math.max(token.data.brightLight, 10), dimLight: Math.max(token.data.dimLight, 20), lightColor: "#faffd1"});
	}

	// If there's already a combat running, track it
	if (ui.combat.combat?.current?.tokenId) {
		prevCombatant = ui.combat.combat.current.tokenId;
	}
})();
