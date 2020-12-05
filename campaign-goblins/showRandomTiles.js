/** Show a random selection of up to three tiles in the current scene, hiding the rest. */
(() => {
	let numVisible = 0;
	[...canvas.tiles.placeables].shuffle().forEach(it => {
		const isVisible = numVisible < 3 && Math.random() < 0.4;
		it.update({hidden: !isVisible});
		if (isVisible) numVisible++;
	})
})();

/** Hide all tiles in the current scene */
canvas.tiles.placeables.forEach(it => it.update({hidden: true}));


/** Move all the tiles in the current scene to a position */
canvas.tiles.placeables.forEach(it => it.update({x: 1500, y: 1100}));


/** "Flashbang" effect */
(async () => {
	const data = {
		width: 5700,
		height: 4300,
		x: 1500,
		y: 1100,

		author: "NQxNNE2Vq7DTqMjf",
		bezierFactor: 0,
		fillAlpha: 1,
		fillType: 1,
		flags: {},
		fontFamily: "Signika",
		fontSize: 48,
		hidden: false,
		locked: false,
		points: [],
		rotation: 0,
		strokeAlpha: 0,
		strokeColor: "#ffffff",
		strokeWidth: 0,
		text: "",
		textAlpha: 0,
		textColor: "#ffffff",
		texture: "",
		type: "r",
		z: 0
	};

	const getCpy = () => MiscUtil.copy(data);

	const colors = [
		"#ffffff",
		"#ffffff",
		"#eeffff",
		"#ffffff",
		"#ffffff",
		"#ffffff",
		"#ffffff",
		"#ffffff",
		"#ffffff",
		"#eeffff",
		"#ffffff",
		"#ffffff",
		"#ffffff",
		"#ffffff",
		"#eeffff",
		"#eeffff",
		"#ffffff",
		"#ffffff",
		"#ffffff",
		"#ffffff",

		"#ffffff",
		"#f9f9f9",
		// "#f3f3f3",
		"#ededed",
		"#e7e7e7",
		// "#e1e1e1",
		"#dbdbdb",
		"#d5d5d5",
		// "#cfcfcf",
		"#c9c9c9",
		// "#c4c4c4",
		"#bebebe",
		// "#b8b8b8",
		"#b2b2b2",
		// "#acacac",
		"#a6a6a6",
		// "#a0a0a0",
		"#9a9a9a",
		// "#949494",
		"#8e8e8e",
		// "#888888",
		// "#828282",
		"#7c7c7c",
		// "#767676",
		// "#707070",
		"#6a6a6a",
		// "#646464",
		// "#5e5e5e",
		"#585858",
		// "#525252",
		// "#4c4c4c",
		"#474747",
		// "#414141",
		// "#3b3b3b",
		"#353535",
		// "#2f2f2f",
		// "#292929",
		"#232323",
		"#1d1d1d",
		"#171717",
		// "#111111",
	];

	for (const c of colors) {
		const flash = getCpy();
		flash.fillColor = c;
		await Drawing.create(flash);
		await MiscUtil.pDelay(35);
	}
})()
