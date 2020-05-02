/**
 * A script used in a set-piece where an elevator light was switched from a steady white glow, to a rotating red warning
 * light.
 */

const lightWhite = canvas.lighting.placeables.find(it => it.id === "WPZuKbwhZzpQWQO2");
const lightRed = canvas.lighting.placeables.find(it => it.id === "2BhqDrwwycFegNKv");

ui.notifications.info(window._IS_ALARM_ON ? `Deactivating alarm` : `Activating alarm`);
if (window._IS_ALARM_ON) {
	clearInterval(window._IV_ALARM);

	const update = [
		{
			_id: lightWhite.id,
			dim: 50,
			bright: 50
		},
		{
			_id: lightRed.id,
			dim: 0,
			bright: 0
		}
	];

	canvas.scene.updateEmbeddedEntity("AmbientLight", update);

	window._IS_ALARM_ON = false;
} else {
	const update = [
		{
			_id: lightWhite.id,
			dim: 0,
			bright: 0
		},
		{
			_id: lightRed.id,
			dim: 35,
			bright: 17
		}
	];

	canvas.scene.updateEmbeddedEntity("AmbientLight", update);

	window._IV_ALARM = setInterval(() => {
		let rot = lightRed.data.rotation + 11;
		if (rot > 360) rot = rot - 360;

		const update = [
			{
				_id: lightRed.id,
				rotation: rot
			}
		];

		canvas.scene.updateEmbeddedEntity("AmbientLight", update);
	}, 33);

	window._IS_ALARM_ON = true;
}
