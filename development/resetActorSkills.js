/** Quickly set all an actor's skill proficiencies to a given value. */
(async () => {
	const ACTOR_ID = "<your ID here>";
	const PROF_LEVEL = 0; // 0 = not, 1 = proficient, 2 = expert, 0.5 = jack of all trades

	await Actor.collection.get(ACTOR_ID).update({data: {skills: Object.keys(CONFIG.DND5E.skills).map(it => ({[it]: {value: PROF_LEVEL}})).reduce((a, b) => Object.assign(a, b), {})}})
})();
