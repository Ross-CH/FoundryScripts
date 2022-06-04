/**
 * Present a UI for quickly searching through every default Foundry icon, and applying it to whichever sheet was active
 * when the macro was run.
 */
(async () => {
	const $getAppElement = app => {
		if (!app?.element) return null;
		if (app.element instanceof jQuery) return app.element;
		return $(app.element);
	};

	const app = Object.entries(ui.windows)
		.map(([appId, app]) => {
			const zIndex = Number(((($getAppElement(app)[0] || {}).style || {})["z-index"] || -1));
			if (isNaN(zIndex) || !~zIndex) console.warn(`Could not determine z-index for app ${appId}`);
			return {
				appId,
				app,
				zIndex: isNaN(zIndex) ? -1 : zIndex,
			};
		})
		.sort((a, b) => b.zIndex - a.zIndex)
		.map(({app}) => app)
		.filter(app => app.document)[0];

	if (!app) return ui.notifications.warn("No open doc windows!");

	const pListFiles = async (path = "icons", out) => {
		out = out || [];

		const res = await FilePicker.browse("public", path);

		res.files
			.filter(it => it.endsWith(".webp"))
			.forEach(it => out.push(it));

		await Promise.all(res.dirs.map(dir => pListFiles(dir, out)));

		return out;
	};

	const iconPaths = await pListFiles();

	let sel = null;
	const window = new Dialog(
		{
			title: `Select Icon for ${app.document.name}`,
			content: `<p><i>Loading...</i></p>`,
			buttons: {
				ok: {
					icon: `<i class="fas fa-check"></i>`,
					label: "Select",
					callback: async () => {
						const doc = app.document;

						try {
							if (!doc.parent) {
								await doc.update({img: sel.path});
								ui.notifications.info(`Updated icon to "${sel.path}"!`);
								return;
							}

							await doc.parent.updateEmbeddedDocuments(
								doc.documentName,
								[
									{
										_id: doc.id,
										img: sel.path,
									}
								]
							);
							ui.notifications.info(`Updated icon to "${sel.path}"!`);
						} catch (e) {
							ui.notifications.error(`Failed to set icon! See the console for more details.`);
							console.error(e);
						}
					},
				},
				cancel: {
					icon: `<i class="fas fa-times"></i>`,
					label: "Cancel",
				}
			},
			default: "ok",
			render: $html => {
				const html = $html[0];
				html.style["flex"] = "unset";
				html.style["width"] = "100%";
				html.style["height"] = "100%";
				html.style["minHeight"] = "0";
				html.style["display"] = "flex";
				html.style["flexDirection"] = "column";

				let tSearch = null;
				const iconMetas = [];

				const $iptSearch = $(`<input type="text" style="margin-bottom: 5px; width: 100%;" placeholder="Search icon...">`)
					.keydown(() => {
						clearTimeout(tSearch);
						tSearch = setTimeout(() => {
							const searchTerm = $iptSearch.val().trim().toLowerCase();

							if (searchTerm.length < 3) {
								iconMetas.forEach(meta => meta.wrpIcon.style.display = "none");
								return;
							}

							iconMetas.forEach(meta => {
								const isShow = meta.searchKey.includes(searchTerm)
								meta.wrpIcon.style.display = isShow ? "block" : "none"
							})
						}, 125);
					});

				const wrpIcons = document.createElement("div");
				wrpIcons.setAttribute("style", "overflow-y: auto; display: flex; flex-wrap: wrap; width: 100%; height: 100%; transform: translateZ(0); min-height: 0; margin-bottom: 5px;");

				iconPaths.forEach(path => {
					const wrpIcon = document.createElement("div");
					wrpIcon.setAttribute("style", "width: 160px; height: 160px; flex-shrink: 0; flex-grow: 0; position: relative; cursor: pointer; border: 3px solid #333; display: none;");
					wrpIcons.appendChild(wrpIcon);
					wrpIcon.addEventListener("click", () => {
						if (sel) {
							sel.wrpIcon.style.borderColor  = "";
						}

						if (sel === meta) {
							sel = null;
							return;
						}

						sel = meta;
						sel.wrpIcon.style.borderColor  = "red";
					});

					const name = path.split("/").slice(-1)[0].toLowerCase();

					wrpIcon.innerHTML = `<img src="${path}" style="width: 100%; height: 100%; border: 0;">
<div style="width: 100%; color: white; background: #111b; pointer-events: none; position: absolute; bottom: 0; left: 0; right: 0; font-size: 80%; padding: 0 3px; text-align: center;">${name}</div>`

					const meta = {
						path,
						searchKey: name,
						wrpIcon,
					};

					iconMetas.push(meta);
				});

				html.innerHTML = "";
				html.appendChild($iptSearch[0]);
				html.appendChild(wrpIcons);
			},
		},
		{
			width: 680,
			height: 900,
			resizable: true,
		}
	);
	window.render(true);
})();
