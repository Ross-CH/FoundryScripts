/**
 * Quickly (re)set all an actor's proficiencies, senses, damage res./vuln./imm., condition imm., race, background, ...
 * @version 0.8.9
 */
(async () => {
	const ACTOR_ID = "<your ID here>";

	// 0 = not, 1 = proficient, 2 = expert, 0.5 = jack of all trades
	const SAVE_PROF_LEVEL = 0;
	const SKILL_PROF_LEVEL = 0;

	// Feet/etc.
	const SENSE_RANGE = 0;

	await CONFIG.Actor.collection.instance.get(ACTOR_ID)
		.update({
			data: {
				abilities: Object.keys(CONFIG.DND5E.abilities)
					.map(it => ({[it]: {proficient: SAVE_PROF_LEVEL, value: 10}}))
					.reduce((a, b) => Object.assign(a, b), {}),
				skills: Object.keys(CONFIG.DND5E.skills)
					.map(it => ({[it]: {value: SKILL_PROF_LEVEL}}))
					.reduce((a, b) => Object.assign(a, b), {}),
				attributes: {
					senses: Object.keys(CONFIG.DND5E.senses)
						.map(it => ({[it]: SENSE_RANGE}))
						.reduce((a, b) => Object.assign(a, b), {special: ""}),
					hp: {value: 0, max: 0, temp: null, tempmax: null},
					movement: {burrow: 0, climb: 0, fly: 0, swim: 0, walk: 0, units: "ft", hover: false},
				},
				traits: {
					di: {value: [], custom: ""},
					dr: {value: [], custom: ""},
					dv: {value: [], custom: ""},
					ci: {value: [], custom: ""},
					languages: {value: [], custom: ""},
					weaponProf: {value: [], custom: ""},
					armorProf: {value: [], custom: ""},
					toolProf: {value: [], custom: ""},
				},
				details: {race: "", background: ""},
				currency: {pp: 0, gp: 0, ep: 0, sp: 0, cp: 0},
			}
		});
})();
