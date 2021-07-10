/**
 * Create nested folders.
 * Note that Foundry only "supports" `CONST.FOLDER_MAX_DEPTH` nested folders, but will render the remaining folders in
 * the directory root.
 **/
(async () => {
	const DEPTH = 10;

	let folder;
	for (let i = 0; i < DEPTH; ++i) {
		const folderData = {
			name: `folder ${i}`,
			parent: folder ? folder._id : null,
			type: "Actor",
		};
		folder = await Folder.create(folderData, {});
	}
})();
