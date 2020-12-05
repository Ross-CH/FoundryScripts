/** Spawn a selection of tokens */
(async () => {
	const MIN_X = 1500 + 200;
	const MIN_Y = 1100 + 200;
	const MAX_X = MIN_X + canvas.scene.data.width - 200;
	const MAX_Y = MIN_Y + canvas.scene.data.height - 200;

	const creatureIdBlight = "iGYLgPPzev7qc6o7";
	const creatureIdSpawn = "R9jpArECOG8jKGAu";

	const blightsToSpawn = Math.max(1, Math.round(Math.random() * 3)); // 1-3
	const spawnToSpawn = Math.random() < 0.5; // 0-1

	for (let i = 0; i < blightsToSpawn; ++i) {
		const tokensToCreate = [];
		let tokenData = {
			x: Math.round((MAX_X - MIN_X) * Math.random()) + MIN_X,
			y: Math.round((MAX_Y - MIN_Y) * Math.random()) + MIN_Y
		};

		// taken from `dropActor`
		tokenData = mergeObject(Actor.collection.get(creatureIdBlight).data.token, tokenData, {inplace: false});
		tokensToCreate.push(tokenData);

		for (const tokenData of tokensToCreate) {
			await Token.create(tokenData);
		}
	}

	for (let i = 0; i < spawnToSpawn; ++i) {
		const tokensToCreate = [];
		let tokenData = {
			x: Math.round((MAX_X - MIN_X) * Math.random()) + MIN_X,
			y: Math.round((MAX_Y - MIN_Y) * Math.random()) + MIN_Y
		};

		// taken from `dropActor`
		tokenData = mergeObject(Actor.collection.get(creatureIdSpawn).data.token, tokenData, {inplace: false});
		tokensToCreate.push(tokenData);

		for (const tokenData of tokensToCreate) {
			await Token.create(tokenData);
		}
	}
})();
