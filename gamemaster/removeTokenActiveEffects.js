/**
 * Remove all Active Effects from the currently selected tokens.
 * For Foundry v9.
 */
(async () => {
	for (const token of canvas.tokens.controlled) {
		await token.actor.deleteEmbeddedDocuments("ActiveEffect", token.actor.effects.contents.map(({id}) => id))
	}
})()
