/**
 * Check if all the requirements for a given module are satisfied.
 **/
(() => {
	const MODULE_ID = "my-module-id";

	[...game.modules.get(MODULE_ID).relationships.requires]
		.filter(it => !game.modules.get(it.id)?.active)
		.forEach(it => console.warn(`Module not ${game.modules.get(it.id) ? "active" : "installed"}: "${it.id}" -- get it from https://foundryvtt.com/packages/${it.id}`));
})();
