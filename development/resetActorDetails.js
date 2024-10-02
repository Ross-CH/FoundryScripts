/**
 * Quickly (re)set all your actor's proficiencies, senses, damage res./vuln./imm., condition imm., race, background, ...
 * @version v12
 */
(async () => {
	// 0 = not, 1 = proficient, 2 = expert, 0.5 = jack of all trades
	const SAVE_PROF_LEVEL = 0;
	const SKILL_PROF_LEVEL = 0;

	await game.user.character
		.update({
			system: {
				abilities: Object.keys(CONFIG.DND5E.abilities)
					.map(it => ({[it]: {proficient: SAVE_PROF_LEVEL, value: 10}}))
					.reduce((a, b) => Object.assign(a, b), {}),
				skills: Object.keys(CONFIG.DND5E.skills)
					.map(it => ({[it]: {value: SKILL_PROF_LEVEL}}))
					.reduce((a, b) => Object.assign(a, b), {}),
				tools: Object.keys(game.user.character.system.tools)
					.map(it => ({[`-=${it}`]: null}))
					.reduce((a, b) => Object.assign(a, b), {}),
				attributes: {
					senses: Object.keys(CONFIG.DND5E.senses)
						.map(it => ({[it]: null}))
						.reduce((a, b) => Object.assign(a, b), {special: ""}),
					hp: {value: 0, max: null, temp: null, tempmax: null},
					movement: {burrow: null, climb: null, fly: null, swim: null, walk: null, units: "ft", hover: false},
				},
				traits: {
					di: {value: [], custom: ""},
					dr: {value: [], custom: ""},
					dv: {value: [], custom: ""},
					ci: {value: [], custom: ""},
					languages: {value: [], custom: ""},
					weaponProf: {value: [], custom: ""},
					armorProf: {value: [], custom: ""},
					size: "med",
				},
				details: {
					race: "",
					background: "",

					alignment: "",
					gender: "",
					eyes: "",
					height: "",
					faith: "",
					hair: "",
					skin: "",
					age: "",
					weight: "",

					ideal: "",
					bond: "",
					flaw: "",
					trait: "",
					appearance: "",

					biography: {
						"value": "",
						"public": ""
					},
				},
				resources: ["primary", "secondary", "tertiary"]
					.map(it => ({[it]: {value: null, max: null, label: "", sr: false, lr: false}}))
					.reduce((a, b) => Object.assign(a, b)),
				currency: {pp: 0, gp: 0, ep: 0, sp: 0, cp: 0},
			}
		});
})();
