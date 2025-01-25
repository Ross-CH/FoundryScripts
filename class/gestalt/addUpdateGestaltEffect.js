/**
 * Set a gestalt character's:
 * - proficiency bonus
 * - level
 * - spell slots
 *
 * based on the rules found here:
 * https://homebrewery.naturalcrit.com/share/H1OBqNJDN
 * - 1.5x spell slots variant
 */
(async () => {
	const {character} = game.user
	const LSTART = 5
	const PROGS = ["full", "artificer", "half", "third"]

	const clsItems = character.items.filter(it => it.type === "class")
	const lvl = Math.max(...clsItems.map(it => it.system?.levels), LSTART)
	const pb = Math.ceil(lvl / 4) + 1

	const slots = Array.from({length: 9}, () => 0);
	[...clsItems, ...character.items.filter(it => it.type === "subclass")]
		.map(it => it.system.spellcasting?.progression)
		.filter(it => it && it !== "none")
		.sort((a, b) => PROGS.indexOf(a) - PROGS.indexOf(b))
		.forEach((pr, i) => {
			if (!PROGS.includes(pr)) return
			const lvlEff = Math.ceil(lvl / (pr === "full" ? 1 : (pr === "half" || pr === "artificer") ? 2 : pr === "third" ? 3 : 99))
			const slotsProg = [...CONFIG.DND5E.SPELL_SLOT_TABLE[lvlEff - 1]];
			slotsProg.forEach((cnt, sLvl) => slots[sLvl] += Math.ceil(cnt / (!i ? 1 : 2)));
		})

	const body = {
		type: "base",
		changes: [
			{key: "system.details.level", mode: 5, value: `${lvl}`},
			{key: "system.attributes.prof", mode: 5, value: `${pb}`},
			...slots
				.map((cnt, ixS) => ({key: `system.spells.spell${ixS + 1}.override`, mode: 5, value: `${cnt}`})),
		],
		flags: {fcu: {isGestalt: true}},
	}

	const existing = character.effects.find(eff => eff.flags["fcu"]?.["isGestalt"]);
	if (existing) await character.updateEmbeddedDocuments("ActiveEffect", [{"_id": existing._id, ...body}]);
	else await character.createEmbeddedDocuments("ActiveEffect", [{name: "Gestalt Adjustments", img: "https://i.imgur.com/SEFh5y0.png", ...body}])

	ui.notifications.info(`Gestalt effect set for "${character.name}" (${character.id})!`)
})();
