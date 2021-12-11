/**
 * Quick 'n' dirty script to import Standard Deck Format (SDF) YAML decks to v9 Foundry.
 * Requires Plutonium to be active.
 * @see https://github.com/spacemandev-git/fvtt-card-support
 */
(async () => {
	if (!window.jsyaml) {
		ui.notifications.info("Loading YAML library...");
		const text = await (await fetch("https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js")).text();
		eval(text); // :)
	}

	class SdfImporter extends Application {
		constructor () {
			super({
				width: 600,
				height: 180,
				title: "Import SDF YAML",
				template: `modules/plutonium/template/ImportList.hbs`,
				resizable: true
			});
		}

		activateListeners ($html) {
			$html.empty().addClass("flex-col h-100 ve-window min-h-0");

			const comp = BaseComponent.fromObject({
				deckName: "Unnamed Deck",
				prefixImage: "assets/cards/",
			});

			const $iptDeckName = ComponentUiUtil.$getIptStr(comp, "deckName");

			const $iptPrefixImage = ComponentUiUtil.$getIptStr(comp, "prefixImage");

			const $iptFile = $(`<input class="w-100" type="file" accept=".yaml,.yml">`)

			const $btnImport = $(`<button class="btn btn-5et btn-default w-100">Import</button>`)
				.click(() => {
					if (!$iptFile[0].files?.[0]) return ui.notifications.error("Please select a file!");

					const reader = new FileReader();
					reader.onload = async () => {
						const text = reader.result;

						let yaml;
						try {
							yaml = jsyaml.loadAll(text);
						} catch (e) {
							ui.notifications.error(`Failed to load YAML! ${VeCt.STR_SEE_CONSOLE}`);
							throw e;
						}

						await SdfImporter._pDoImport({yaml, state: comp.toObject()});
					};

					reader.readAsText($iptFile[0].files[0]);
				});

			$$($html)`
				<label class="mb-2 split-v-center w-100">
					<div class="no-wrap mr-2">Deck Name</div>
					${$iptDeckName}
				</label>

				<label class="mb-2 split-v-center w-100">
					<div class="no-wrap mr-2" title="The path to your image directory (relative to your Foundry user data folder) for this deck.">Image Prefix</div>
					${$iptPrefixImage}
				</label>

				<label class="mb-2 split-v-center w-100">
					<div class="no-wrap mr-2">File</div>
					${$iptFile}
				</label>

				<div class="mb-2">
					${$btnImport}
				</div>
			`
		}

		static async _pDoImport ({yaml, state}) {
			try {
				await this._pDoImport_({yaml, state});
			} catch (e) {
				ui.notifications.error(`Failed to import cards! ${VeCt.STR_SEE_CONSOLE}`);
				throw e;
			}
		}

		static async _pDoImport_ ({yaml, state}) {
			if (!yaml?.length) return ui.notifications.warn(`No cards found!`);

			const getImagePath = name => [state.prefixImage, name].join("/").replace(/\/+/g, "/");

			const docDeck = await Cards.create({
				name: state.deckName,
				img: getImagePath(yaml[0].back), // Use the first card's back as the default back
			});

			const cardData = yaml.map(it => {
				const baseData = {
					name: it.name,
					faces: [
						{
							img: it.img ? getImagePath(it.img) : "",
							name: it.name,
						}
					],
					suit: it.data?.suit,
					value: it.data?.value,
					back: {
						img: it.back ? getImagePath(it.back) : "",
					}
				};

				// Make multiple copies of the same card, if there are multiple copies in the deck
				return [...new Array(it.qty ?? 1)].map(() => MiscUtil.copy(baseData));
			}).flat();

			await docDeck.createEmbeddedDocuments("Card", cardData);
		}
	}
	(new SdfImporter()).render(true);
})()
