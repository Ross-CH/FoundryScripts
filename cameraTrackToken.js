/**
 * Usage: select token, activate macro. When moving the token, the camera will follow.
 * Toggle it off by pressing the macro again.
 *
 * Note: logic for "on token delete" not included. Use with caution.
 * */
(async () => {
	if (!token) return ui.notifications.error(`No token selected!`);

	const W_SIDEBAR = 300;

	window.__cameraTrackToken_token = token;

	if (window.__cameraTrackToken_active != null) {
		window.__cameraTrackToken_active = !window.__cameraTrackToken_active;
		return;
	}

	window.__cameraTrackToken_active = true;

	Hooks.on("preUpdateToken", async (scene, token, updateData) => {
		if (!window.__cameraTrackToken_active) return;
		if (updateData.x == null && updateData.y == null) return;
		if (window.__cameraTrackToken_token.id !== token._id) return;

		if (token.x !== updateData.x || token.y !== updateData.y) {
			const xOffsetSidebar = (ui.sidebar._collapsed ? 0 : 1) * (W_SIDEBAR / 2);

			const xNext = updateData.x == null ? token.x : updateData.x;
			const yNext = updateData.y == null ? token.y : updateData.y;

			canvas.pan({
				x: xNext + xOffsetSidebar + (window.__cameraTrackToken_token.w / 2),
				y: yNext + (window.__cameraTrackToken_token.h / 2),
			});
		}
	});
})();
