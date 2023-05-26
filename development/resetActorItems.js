/**
 * Quickly reset your actor's items.
 * @version v11
 */
(async () => {
	const ids = game.user.character.items.map(it => it.id);
	await game.user.character
		.deleteEmbeddedDocuments("Item", ids);
})();
