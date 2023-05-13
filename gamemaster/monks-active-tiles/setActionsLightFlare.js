/**
 * Set "Monks's Active Tiles" actions on a tile.
 * These action brighten, and then dim, lights <a href="!https://foundryvtt.com/packages/tagger">tagged</a>
 * with "LightFlare", in a rudimentary "ease-in-out" animation.
 *
 * @version 10
 */
(async () => {
	const DELAY = 0.02;
	const DELTA = (1 / 7).toFixed(3);

	const STEP_DELAY = [
		DELAY,
		2 * DELAY,
		4 * DELAY,
		8 * DELAY,
		8 * DELAY,
		4 * DELAY,
		2 * DELAY,
		DELAY,
	];

	const BASE_ALTER = {
		"action": "alter",
		"data": {
			"entity": {
				"id": "tagger:LightFlare",
				"match": "all",
				"scene": "_active",
				"name": "<i class=\"fas fa-tag fa-sm\"></i> LightFlare",
			},
			"collection": "tokens",
			"attribute": "config.alpha",
			"chatMessage": false,
			"rollmode": "roll",
		},
	};

	/* -------------------------------------------- */

	const getStepDelay = i => {
		if (STEP_DELAY[i] == null) throw new Error(`${i} was not in range!`);
		return STEP_DELAY[i];
	};

	const getAlterAction = obj => {
		return foundry.utils.mergeObject(
			foundry.utils.deepClone(BASE_ALTER),
			{
				...obj,
				"id": foundry.utils.randomID(),
			},
		);
	};

	const getDelayAction = (ms) => {
		return {
			"action": "delay",
			"data": {
				"delay": `${ms}`,
			},
			"id": foundry.utils.randomID(),
		};
	};

	/* -------------------------------------------- */

	if (game.canvas.tiles.controlled?.length !== 1) return ui.notifications.error("Please select exactly one tile!");
	const tile = game.canvas.tiles.controlled[0];

	/* -------------------------------------------- */

	const actions = [];

	// Increase glow
	for (let i = 0; i < 8; ++i) {
		actions.push(getAlterAction({
			"data": {
				"value": `+ ${DELTA}`,
			},
		}));

		actions.push(getDelayAction(getStepDelay(i)));
	}

	// Pause at max brightness
	actions.push(getAlterAction({
		"data": {
			"value": `1`,
		},
	}));
	actions.push(getDelayAction(0.75));

	// Decrease glow
	for (let i = 7; i >= 0; --i) {
		actions.push(getAlterAction({
			"data": {
				"value": `- ${DELTA}`,
			},
		}));

		if (i !== 0) actions.push(getDelayAction(getStepDelay(i)));
	}

	// Ensure reset to exactly zero
	actions.push(getAlterAction({
		"data": {
			"value": `0`,
		},
	}));

	console.log("Setting actions:");
	console.log(actions);

	await tile.setFlag("monks-active-tiles", "actions", actions);
})();
