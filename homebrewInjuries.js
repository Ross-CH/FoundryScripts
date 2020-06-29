/**
 * An implementation of ash's "AH5E Injury Table" homebrew (see: https://www.gmbinder.com/share/-LlZxrJms4819NpEAQPc)
 */
(async () => {
	const STEP_1_TABLES = [
		`**1-2**| Reroll on Table 2 |
**3-12**| Minor Injury |
**13-18**| Medium Injury |
**19-20**| Major Injury  |`,
		`**1-2**| Reroll on Table 3 |
**3-4**| Minor Injury |
**5-6**| Medium Injury |
**7-10**| Minor Injury  |
**11-18**| Medium Injury|
**19-20** | Major Injury |`,
		`**1-2**| Reroll on Table 4  |
**3-6**| Major Injury |
**7-10**| Medium Injury |
**11**| Minor Injury  |
**12-16** |Medium Injury|
**17-20**|Deadly Injury`,
		`**1-2**| Deadly Injury  |
**3-10**| Major Injury |
**11**| Minor Injury  |
**12-15** |Medium Injury|
**16-18**|Major Injury
**19-20** |Deadly Injury|`
	];
	const STEP_2_TABLES = {
		"Minor Injuries": `|**1. Shaken:** Your vision blurs as your eyes begin to water; your hearing is overcome with a shrill ringing; there is a taste of blood on your tongue; you are dazed and reeling. You suffer disadvantage on Initiative and Wisdom (Perception) checks until you complete a short rest at least one hour long.|
|**2. Infected Wound:** A wound you have suffered rests pustulating beneath a shroud of sores and scabs. Your hit point maximum is reduced by 5, and an additional 5 for each day that it festers, until you succeed a DC 15 Constitution saving throw, or a Wisdom (Medicine) check with appropriate supplies is performed on the wound during a short rest.|
|**3. Minor Scar:** A wicked looking testament to your dangerous choice in lifestyle that, while impressing some and revulsing others, serves as a reminder of how close to death you brushed.|
|**4. Minor Concussion:** Your eyes drift aimlessly around in their sockets, instilling you with an unshakeable sense of vertigo and filling your head with fuzzy, formless thoughts. You suffer disadvantage on any checks made with Intelligence or Wisdom until you complete a short rest at least one hour long.|
|**5. Sprained Ankle:** Shooting pain fires upwards through your leg as you put even the slightest bit of weight on a swollen, twisted ankle. Your speed is lowered by 5 feet until you complete a short rest of at least one hour long.|
|**6. Bruised Spine:** Tender to the touch and worsened with each strenuous action you take, be it large or small. You suffer disadvantage on Strength (Athletics) and Dexterity (Acrobatics) checks until you complete a short rest at least one hour long.|
|**7. Distracting Pain:** There is a deep, dull tension somewhere in the muscles that rankles at you with every waking second, stealing moments of rest and never easing up. You suffer disadvantage on Initiative and checks to maintain concentration on spells until you complete a short rest at least one hour long.|
|**8. Broken Fingers:** Though easily bent back into shape and righted, the process does nothing to absolve the pain. You suffer disadvantage on Dexterity (Sleight of Hand) checks and attack rolls made as part of spells that require somatic components until you complete a short rest at least one hour long.|
|**9. Bitten Tongue:** The taste of blood in your mouth is accompanied with the inability to speak without lisping. You suffer disadvantage on Charisma checks and attack rolls made as part of spells that require vocal components until you complete a short rest at least one hour long.|
|**10. Broken Nose:** Bent at an odd angle and made crooked in such a way as to whistle when you breathe through it. You suffer disadvantage on Dexterity (Stealth) checks and scent based Wisdom (Perception) checks until you complete a short rest at least one hour long.|
|**11. Black Eye:** A shiny, blackish-blue ring that has swollen one of your eyes completely shut. Darkvision’s radius is reduced by half and you suffer disadvantage on ranged attack rolls beyond 30 feet of you until you complete a short rest at least one hour long.|
|**12. Overexertion:** You’ve been through the wringer and come out the other side a little worse for wear. You suffer one level of exhaustion.|`,
		"Medium Injuries": `|**1. Hairline Arm Fracture:** A crack in the forearm or a split between the elbow; you clutch your arm closely to your body as it hangs limply in pain. Your arm is considered to be disabled for the purposes of free actions, using items, interaction, etc, and you suffer disadvantage when using two-handed weapons until you complete a long rest, or receive magic healing of 2nd level or higher.|
|**2. Hairline Leg Fracture:** A crack in the shin or a split between the knee; you limp with a laborious gait as your leg can no longer support your weight. Your speed is halved until you complete a long rest, or receive magic healing of 2nd level or higher.|
|**3. Bruised Ribs:** Your breath is reduced to sharp inhalations as your sides seem to protest with each drawing of air. You suffer one level of exhaustion, and can no longer take the dash action until you complete a long rest, or receive magic healing of 2nd level or higher.|
|**4. Minor Rupture:** You grow weary and lightheaded as a wound begins to overflow and clot with blood. You suffer one level of exhaustion, and can only regain the minimum results of any healing you receive until you complete a long rest.|
|**5. Unnerving Scar:** A section of your flesh has been carved and torn to pieces, leaving behind a labyrinth of scar tissue that speaks to the hardships you have suffered and survived.|
|**6. Concussion:** You stumble about as if in a fog, recollecting little of the past moments save for wiping the vomit from your lips, and the tears from your ears. You suffer disadvantage on Intelligence and Wisdom checks and saving throws until you complete a long rest, or receive magic healing of 2nd level or higher.|
|**7. Slipped Disc:** The thin, fragile cord that operates your entire body has been twisted and misaligned; the pain is sharp and comes in sudden jolts. You suffer disadvantage on Strength and Dexterity checks and saving throws until you complete a long rest, or receive magic healing of 2nd level or higher.|
|**8. Festering Wound:** A thick film of congealed, pus-ridden blood weeps from this itchy, never closing wound. Your hit point maximum is reduced by 10, and an additional 10 for each day that it festers until you succeed a DC 20 Constitution saving throw, are subject to a Lesser Restoration spell, or a Wisdom (Medicine) check with appropriate supplies is performed on the wound during a short rest.|
|**9. Burst Ear Drums:** You see mouths move but hear only the rush of your own blood between ringing, useless ears. You suffer the Deafened condition until you complete a long rest, or receive magical healing of 2nd level or higher.|
|**10. Orbital Fracture:** Blood clouds your vision and the very act of opening your eyes is a taxing and painful endeavour. Your vision is reduced to 15 feet and you suffer disadvantage on any checks or saves that are reliant on sight until you complete a long rest, or receive magical healing of 2nd level or higher.|
|**11. Shattered Hand:** The mangled remains of your once dexterous and nimble digits jut outwards at odd and jagged angles. Your hand is considered to be disabled for the purposes of free actions, using items, interaction, etc, you suffer disadvantage when using two-handed weapons, and are unable to cast spells that require somatic components until you complete a long rest, or receive magical healing of 2nd level or higher.|
|**12. Shattered Jaw:** Pieces of teeth fall from your gums as blood and spittle form a frothy mixture dribbling down your chin. Your mouth is considered to be disabled for the purposes of free actions, using items, interaction, etc, and you are unable to cast spells that require vocal components until you complete a long rest, or receive magical healing of 2nd level or higher.|`,
		"Major Injuries": `|**1. Broken Arm:** An eye-watering snap followed by a lance of white-hot pain; the arm is finished. Your arm is considered to be disabled for the purposes of free actions, using items, interaction, etc, you are unable to wield two-handed weapons and are unable to cast spells that require somatic components until you complete a long rest and receive magical healing of 3rd level or higher.|
|**2. Mangled Foot:** Nothing more remains of it other than a stump of hardened flesh in the vague shape of a foot. Your speed is reduced to 15 feet, and you require a cane or similar implement to move without falling prone at the end of your turn until you complete a long rest and receive magical healing of 3rd level or higher.|
|**3. Shattered Ribs:** The very act of breathing has become a torturous affair; each inhalation sends stabbing pains all across your chest and threatens to pierce your lungs. You suffer two levels of exhaustion, and can not take the dash action until you complete a long rest and receive magical healing of 3rd level or higher.|
|**4. Hideous Scarring:** Whether you were cursed with leprosy at one point or otherwise fell into a basket of razor blades at birth, this much is certain; you are hideous. You suffer disadvantage on any Charisma checks that are not made to intimidate; children will flee from you; guards will be suspicious of you; and animals will shy away from you until you complete a long rest and receive magical healing of 3rd level or higher. Ugh.|
|**5. Buckled Kneecap:** A sickening pop resonates like the beat of a drum as you feel your knee fold up like a piece of parchment. Your speed is halved, you suffer disadvantage on Dexterity saving throws, are unable to climb without assistance and do so at half speed, landing from any height more than a few feet puts you prone and immediately ends your movement until you complete a long rest and receive magical healing of 3rd level or higher.|
|**6. Mangled Hand:** The flash of pain is followed by a spurt of blood and a powerful, dull ache at the end of your wrist. Your arm is considered to be disabled for the purposes of free actions, using items, interaction, etc, you are unable to wield two-handed weapons and are unable to cast spells that require somatic components until you complete a long rest and receive magical healing of 3rd level or higher.|
|**7. Snapped Thigh:** You bend forward at a place just above the knee and are awash with a dizzying array of pains. Your speed is reduced to 15 feet, you require a cane or similar implement to move without falling prone, and you cannot take the dodge or dash actions until you complete a long rest and receive magical healing of 3rd level or higher.|
|**8. Perforated Lung:** A shortage of breath and tightening pain as if some great hand was clasped around your chest and squeezing down. You suffer two levels of exhaustion, disadvantage on Strength and Constitution saving throws and cannot take the dash action until you complete a long rest and receive magical healing of 3rd level or higher.|
|**9. Major Rupture:** Your visage turns pale as snow, you grow weary and lightheaded as a laceration opens up and begins to gout with thick ropes of blood. You suffer two levels of exhaustion and cannot recover hit points until you complete a long rest and receive magical healing of 3rd level or higher.|
|**10. Soft Tissue Damage:** You feel the strands of muscle beneath your skin peel and snap as the strain begins to unravel you from the inside. You suffer two levels of exhaustion, and you have an Initiative score of 1 regardless of rolls or bonuses until you complete a long rest and receive magical healing of 3rd level or higher.|
|**11. Septic Wound:** Your own body acts against you as this raw and open wound oozes its poisonous bile into your blood, spilling a blackish-green liquid every which way. You suffer two levels of exhaustion, and your hit point maximum is reduced by 15, and an additional 15 for each day that it festers until you complete a long rest and receive magical healing of 3rd level or higher.|
|**12. System Shock:** It’s been a long day. You suffer three levels of exhaustion until you complete a long rest and receive magical healing of 3rd level or higher.|`,
		"Deadly Injuries": `|**1. Shock Trauma:** You are overwhelmed; your senses short out and your body drops limp. You suffer the Unconscious condition and your Constitution score is reduced by 2 until you complete a long rest, or are subject to a Greater Restoration spell.|
|**2. Severed Arm:** Either wrenched from its socket or cleaved from the shoulder, your arm has been removed from your body, sending you into shock. You suffer the Incapacitated condition until the start of your next turn, your arm is considered to be disabled for the purposes of free actions, using items, interaction, etc, you are unable to wield two-handed weapons and are unable to cast spells that require somatic components.|
|**3. Split Skull:** The dome that encases all you are and hope to be is cracked and sundered; turning the world black and your prospects blacker. You suffer the Unconscious condition and your Intelligence score is reduced by 2 until you complete a long rest and are subject to a Greater Restoration spell.|
|**4. Brain Damage:** You take a blow to the head that would kill most people, and might leave others wishing they had been killed. You suffer the Stunned condition until the beginning of your next turn, you suffer disadvantage on Intelligence, Wisdom and Charisma checks and saves, and each of those abilities scores is reduced by 2 until you complete a long rest, or are subject to a Greater Restoration spell.|
|**5. Severed Leg:** Torn away like a scrap of meat or otherwise lopped clean off, your leg has been removed from your body, sending you into shock. You immediately fell prone, you suffer the Incapacitated condition until the start of your next turn, your speed is reduced to 15 feet, you require a cane or similar implement to move without falling prone at the end of your turn, and you cannot take the dodge or dash actions.|
|**6. Disfigured Face:** Mangled and torn to shreds; every inch of your face is in some manner of disrepair, leaving only tattered, bloody ribbons of flesh to dangle from an exposed skull. Your Charisma score is reduced by 2, and you suffer the Blinded condition until you complete a long rest, or are subject to a Greater Restoration spell.|
|**7. Organ Failure:** Somewhere inside your guts is a hole that will not stop throwing out blood, flooding your insides with gore and sapping your strength rapidly. You suffer three levels of exhaustion and cannot recover hit points until you complete a long rest and receive magical healing of 4th level or higher.|
|**8. Broken Spine:** You are broken; unable to even cry out in pain as your spine lays twisted and wrung into oblivion. You immediately fall prone, you suffer the Paralyzed condition, and any attempt to move, drag or carry you requires a DC 18 Wisdom (Medicine) check to avoid imposing an immediate failure of a death saving throw. |
|**9. Crushed Windpipe:** Wheezing and sputtering, you claw at the flattened lump that used to be your throat as you begin to choke on your own blood. You immediately fall prone, you suffer the Paralyzed condition and begin to suffocate, until you receive magical healing of 4th level or higher.|
|**10. Disembowelment:** Your stomach splits open like a slitted purse and begins to spill out your insides. You suffer three levels of exhaustion and the Frightened condition, the source of which is your own intestines, until you complete a long rest and are subject to a Greater Restoration spell.|
|**11. Shattered Hip:** Your midsection buckles and folds under the strain as your hip bone is crushed. You immediately fall prone and cannot stand up, you cannot take the dodge or dash actions, you automatically fail Strength and Dexterity Saving throws, and attack rolls against you are made with advantage until you complete a long rest and are subject to a Greater Restoration spell.|
|**12 Don’t Fear The Reaper:** Despite all that you thought you had left, despite everything that you never did and should have, everything you did do yet you wished you hadn’t, the last slivers of life leave your body and you leave behind an ignominious corpse. You are dead.|`
	};

	const getCleanStep2Name = name => name.toLowerCase().trim().replace(/\s+/g, " ");

	const STEP_2_TABLES_PARSED = Object.entries(STEP_2_TABLES)
		.map(([name, tbl]) => {
			name = getCleanStep2Name(name);
			return {
				[name]: tbl
					.split("\n")
					.map(it => it.trim())
					.filter(Boolean)
					.map(l => l
						.split("|")
						.map(c => c.trim())
						.filter(Boolean)
						.join("")
						.split(/\*\s*\*([^*]+)\*\s*\*/)
						.map(it => it.trim())
						.filter(Boolean)
					)
					.map(([title, text]) => {
						const [n, t] = /^(\d+)\.?\s*(.*)$/.exec(title).slice(1);
						return {
							roll: Number(n),
							title: t,
							text
						}
					})
			};
		})
		.reduce((a, b) => Object.assign(a, b), {});

	const STEP_1_TABLES_PARSED = STEP_1_TABLES
		.map(tbl => tbl
			.split("\n")
			.map(it => it.trim())
			.filter(Boolean)
			.map(l => l
				.split("|")
				.map(c => c.trim())
				.filter(Boolean)
			)
			.map(([cRoll, cRes]) => {
				let [rollMin, rollMax] = cRoll.replace(/\*/g, "").trim().split("-").map(it => it.trim()).filter(Boolean).map(it => Number(it));
				if (isNaN(rollMin)) throw new Error(`Could not parse cell "${cRoll}"`);
				if (rollMax == null) rollMax = rollMin;

				const out = {min: rollMin, max: rollMax};
				const mReroll = /Reroll\s+(?:on\s+)?Table\s+(\d+)/i.exec(cRes);
				if (mReroll) {
					out.rerollOn = Number(mReroll[1]);
				} else {
					const nameStep2 = getCleanStep2Name(cRes.replace(/Injury/i, "Injuries"));
					out.table = STEP_2_TABLES_PARSED[nameStep2];
					if (!out.table) throw new Error(`Could not parse cell "${cRes}"`);
				}
				return out;
			})
	);

	const rawCurTokens = prompt(`Enter your current Injury Token count:`);
	const curTokens = Number(rawCurTokens || "0");
	if (isNaN(curTokens)) return ui.notifications.error(`Please enter a number!`);
	if (curTokens < 0) return ui.notifications.error(`Please enter zero or more!`);
	if (curTokens >= 5) return ui.notifications.error(`Please enter four or less!`);

	const out = [`<i>Rolling on table ${curTokens + 1}</i>`];
	let result;
	do {
		const roll20 = new Roll("1d20");
		roll20.roll();
		result = STEP_1_TABLES_PARSED[curTokens].find(it => roll20.total >= it.min && roll20.total <= it.max);
		if (result.rerollOn != null) {
			out.push(`Rolled 1d20 = ${roll20.total} (Reroll on Table ${result.rerollOn})`);
		} else {
			out.push(`Rolled 1d20 = ${roll20.total}`);
			const roll12 = new Roll("1d12");
			roll12.roll();
			out.push(`Rolled 1d12 = ${roll12.total}`);
			const result2 = result.table.find(it => roll12.total === it.roll);
			out.push(`<b>${result2.title}</b> ${result2.text}`);
		}
	} while (result.rerollOn != null);

	await ChatMessage.create({
		content: `${out.map(it => `<p>${it}</p>`).join("")}`,
		user: game.userId,
		type: 1,
		sound: "sounds/roll.wav"
	});
})();
