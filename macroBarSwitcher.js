/**
 * Allows quick switching between macro bars.
 * Usage: activate macro -> press [1]-[5] (or click the buttons) to switch.
 */
(async () => {
	const showBar = bar => {
		ui.hotbar.page = Math.clamped(bar, 1, 5);
		ui.hotbar.render();

		$iptBar.remove();
		$dispsNumber[ui.hotbar.page - 1]?.css("box-shadow", "0 0 10px #ff6400 inset")

		setTimeout(() => $dispOptions.remove(), 250);
	};

	const cancel = () => {
		$iptBar.remove();
		$dispOptions.remove();
	};

	const $dispOptions = $(`<div style="display: flex; z-index: 70; position: fixed; bottom: 72px; height: 52px; left: 259px;"></div>`).appendTo(document.body);
	const $dispsNumber = [];
	[...new Array(5)].forEach((_, i) => {
		const $dispNumber = $(`<div style="display: flex; justify-content: center; align-items: center; width: 50px; height: 50px; border: 1px solid black; box-shadow: 0 0 5px #444 inset; background: rgba(0, 0, 0, 0.5); border-radius: 2px; cursor: pointer; color: #f0f0e0; font-weight: bold">${i + 1}</div>`)
			.click(() => showBar(i + 1))
			.appendTo($dispOptions);
		$dispsNumber.push($dispNumber);
	});

	const $iptBar = $(`<input style="opacity: 0; position: fixed; top: 0; left: -1000px">`)
		.keydown(evt => {
			evt.preventDefault();
			evt.stopPropagation();
			if (!isNaN(evt.key)) showBar(Math.round(Number(evt.key)));
			else cancel();
		})
		.appendTo(document.body)
		.focus();

	$(document.body).on("keyup.macroBarSwitcher", evt => {
		if (evt.target === $iptBar[0]) return;
		$(document.body).off("keyup.macroBarSwitcher");
		cancel();
	});
})();
