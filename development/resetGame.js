/**
 * Quickly reset most collections in a game.
 */
(async () => {
	const collections = [
		game.scenes,
		game.actors,
		game.items,
		game.journal,
		game.tables,
	];

	for (const coll of collections) {
		const ents = coll
			.filter(it => it.name !== "Test");

		console.log(`Deleting ${ents.length} from ${coll.name}`);

		for (const ent of ents) {
			await ent.delete();
		}
	}

	const folderTypes = new Set(collections.map(coll => coll.constructor.documentName))
	const folders = game.folders.filter(it => folderTypes.has(it.type));
	console.log(`Deleting ${folders.length} folder(s)`)
	for (const ent of folders) {
		await ent.delete();
	}
})();
