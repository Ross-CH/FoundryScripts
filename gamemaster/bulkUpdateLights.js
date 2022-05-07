(async () => {
	window.__bulkUpdateLightState = window.__bulkUpdateLightState || {
		step: 0,
		templateLightData: null,
	};

	switch (window.__bulkUpdateLightState.step) {
		case 0: {
			if (canvas.lighting.controlled.length !== 1) {
				return ui.notifications.error("Select a light to use as a template, then run this macro again!");
			}

			const template = canvas.lighting.controlled[0].data.toJSON();
			["_id", "x", "y"].forEach(prop => delete template[prop]);
			window.__bulkUpdateLightState.templateLightData = template;

			ui.notifications.info("Template light saved. Select some lights to apply this template to, then run this macro again!");

			window.__bulkUpdateLightState.step++;

			return;
		}

		case 1: {
			if (!canvas.lighting.controlled.length) {
				window.__bulkUpdateLightState.step = 0;
				return ui.notifications.error("No lights selected!");
			}

			const updates = canvas.lighting.controlled.map(it => ({
				_id: it.id,
				...foundry.utils.deepClone(window.__bulkUpdateLightState.templateLightData),
			}))
			await canvas.scene.updateEmbeddedDocuments("AmbientLight", updates);

			window.__bulkUpdateLightState.step = 0;

			ui.notifications.info("Lights updated!");

			return;
		}
	}
})();
