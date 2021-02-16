/**
 * Usage: browse around, and drag-drop images to the scene. They'll be spawned in as tokens.
 *
 * Slightly golfmode to fit in Discord's 2k character limit [n.b. they treat tabs as 4 spaces, so you have to convert
 * the tabs before it'll let you send it as a message].
 */

(async () => {
	class X extends FilePicker {
		static getPosCanvasSpace (evt, l) {
			const layer = canvas.layers.find(it => it.name === l), [x, y] = [evt.clientX, evt.clientY], t = layer.worldTransform;
			const tx = (x - t.tx) / canvas.stage.scale.x, ty = (y - t.ty) / canvas.stage.scale.y;
			const p = canvas.grid.getTopLeft(tx, ty);
			return {x: p[0], y: p[1]};
		}

		activateListeners ($html) {
			super.activateListeners($html);
			$html.find(`li.file`)
				.addClass("actor-drop")
				.attr("draggable", true)
				.on("dragstart", evt => {
					const meta = {
						type: "actor-drop",
						path: $(evt.currentTarget).data("path")
					};
					evt.originalEvent.dataTransfer.setData("application/json", JSON.stringify(meta));
				});
			$(document.body)
				.off("dragstart.actor-drop", ".actor-drop")
				.on("dragstart.actor-drop", ".actor-drop", evt => {
					evt.stopPropagation();
				});
			$(`#board`)
				.off("drop.actor-drop")
				.on("drop.actor-drop", evt => {
					let data;
					try {
						const rawJson = evt.originalEvent.dataTransfer.getData("application/json");
						if (!rawJson) return;
						data = JSON.parse(rawJson);
					} catch (e) {
						ui.notifications.error(`Failed to load image!`);
						console.error(e);
					}

					if (!data || data.type !== "actor-drop") return;

					const pos = this.constructor.getPosCanvasSpace(evt, "TokenLayer");
					const size = 1;

					Token.create({
						name: "-",
						x: pos.x,
						y: pos.y,
						img: data.path,
						width: size,
						height: size,
						scale: 1
					});

					return false;
				});
		}
	}
	(new X()).browse();
})();

