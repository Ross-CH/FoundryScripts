/**
 * Quickly reset your actor's active effects.
 * @version v11
 */
(async () => {
	const ids = game.user.character.effects.map(it => it.id);
	await game.user.character
		.deleteEmbeddedDocuments("ActiveEffect", ids);
})();
