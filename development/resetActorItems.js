/**
 * Quickly reset an actor's items.
 * @version 0.8.9
 */
(async () => {
	const ACTOR_ID = "<your ID here>";

	const ids = CONFIG.Actor.collection.instance.get(ACTOR_ID).data.items.map(it => it.id);
	await CONFIG.Actor.collection.instance.get(ACTOR_ID)
		.deleteEmbeddedDocuments("Item", ids);
})();
