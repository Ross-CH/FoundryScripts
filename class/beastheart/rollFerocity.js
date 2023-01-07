/**
 * Roll Ferocity, and add to the selected token.
 * For Foundry v10.
 */
(async () => {
	if (!game.combat) return ui.notifications.warn(`No active combat encounter!`);

	const tokens = [...canvas.tokens.controlled].filter(it => it.actor);
	if (tokens.length !== 1) return ui.notifications.warn(`Please select exactly one token (which has an actor) first!`);

	const token = tokens[0];

	const itmFerocity = token.actor.items.find(it => it.name === "Ferocity");
	if (!itmFerocity) return ui.notifications.warn(`Selected token did not have a "Ferocity" sheet item!`);

	// TODO(Future) automatically calculate the number of hostile tokens within 5 feet? Might be a bad idea!
	class NumberPromptModal extends Dialog {
		constructor () {
			super(
				{
					title: `Creatures Within 5 Feet`,
					buttons: {
						submit: {
							icon: `<i class="fas fa-check"></i>`,
							label: "Submit",
							callback: () => this._pDoCloseAndResolve(),
						},
					},
				},
				{
					width: 310,
					height: 125,
					resizable: true,
				}
			);

			this._resolve = null;
			this._promise = new Promise(resolve => this._resolve = resolve);

			this._$iptCount = null;
		}

		activateListeners ($html) {
			super.activateListeners($html);

			const $wrpContent = $($html.get().find(it => it.classList?.contains("dialog-content"))).empty();

			this._$iptCount = $(`<input type="number" style="text-align: center;" placeholder="Number of Creatures">`)
				.val(0)
				.on("keydown", evt => {
					if (evt.key !== "Enter") return;
					this._pDoCloseAndResolve();
				})
				.appendTo($wrpContent);

			this._$iptCount.focus().select();
		}

		async _pDoCloseAndResolve () {
			await this.close();
			const valRaw = this._$iptCount.val().trim();
			if (!valRaw) return this._resolve(null);
			this._resolve(Math.floor(Number(valRaw)));
		}

		pGetResult () { return this._promise; }
	}

	const modal = new NumberPromptModal();
	await modal.render(true);

	const numAdjacent = await modal.pGetResult();
	if (numAdjacent == null) return;

	// Additional Ferocity from the "Beyond Instinct" feature
	const cntLevelsBeastheart = game.user.character.classes?.beastheart?.system?.levels ?? 0;
	const additionalFerocity = cntLevelsBeastheart >= 15
		? 5
		: cntLevelsBeastheart >= 10
			? 3
			: cntLevelsBeastheart >= 5
				? 1
				: 0;

	const roll = new Roll(`1d4${additionalFerocity ? ` + ${additionalFerocity}` : ""}${numAdjacent ? ` + ${numAdjacent}` : ""}`);
	await roll.evaluate({async: true});

	const totalFerocity = itmFerocity.system.uses.value + roll.total;

	await roll.toMessage({
		speaker: {actor: token.actor},
		flavor: `Ferocity`,
	});

	await token.actor.updateEmbeddedDocuments(
		"Item",
		[
			{
				_id: itmFerocity.id,
				system: {
					uses: {
						value: totalFerocity,
					},
				},
			}
		],
	);

	if (totalFerocity < 10) return;

	await ChatMessage.create({
		speaker: {actor: token.actor},
		content: `<div>
			<p>${token.actor.name} is at risk of entering a rampage!</p>
			<p>${game.user.character.name} must succeed on a DC ${5 + totalFerocity} Wisdom (Animal Handling) check (no action required), or ${token.actor.name} moves up to their speed toward the nearest creature
and attacks that creature with their signature attack.</p>
		</div>`,
		user: game.userId,
		type: 1,
	});
})();
