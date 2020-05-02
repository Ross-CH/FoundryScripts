// Consume a single day of rations from inventory
let name = "Rations (1 day)";
let quantity = 1;
let updates = [];
let consumed = "";
let item = actor.items.find(i=> i.name===name);
let r = new Roll("1d20kh + @prof + @strMod", {prof: 2, strMod: 5});

if (item.data.data.quantity < quantity) {
	ui.notifications.warn(`${game.user.name} no ${name}s remaining`);
	consumed += `No ${name}s remaining.<br>`;
} else {
	updates.push({"_id": item._id, "data.quantity": item.data.data.quantity - quantity});
	consumed += `Consuming ${item.data.name}. ${item.data.data.quantity - quantity} remaining.<br>`;
}

if (updates.length > 0) {
	actor.updateManyEmbeddedEntities("OwnedItem", updates);
}

ChatMessage.create({
	user: game.user._id,
	speaker: { actor: actor, alias: actor.name },
	content: consumed,
	type: CONST.CHAT_MESSAGE_TYPES.OTHER
});
