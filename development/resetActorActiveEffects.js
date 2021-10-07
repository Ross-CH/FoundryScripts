/**
 * Quickly reset an actor's active effects.
 * @version 0.8.9
 */
(async () => {
	const ACTOR_ID = "<your ID here>";

	const ids = CONFIG.Actor.collection.instance.get(ACTOR_ID).data.effects.map(it => it.id);
	await CONFIG.Actor.collection.instance.get(ACTOR_ID)
		.deleteEmbeddedDocuments("ActiveEffect", ids);
})();
