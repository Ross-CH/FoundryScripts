// Retrieve single javelin
let name = "Javelin";
let quantity = 1;
let updates = [];
let consumed = "";
let item = actor.items.find(i=> i.name===name);

updates.push({"_id": item._id, "data.quantity": item.data.data.quantity + quantity});
consumed += `Picking up ${name}. ${item.data.data.quantity + quantity} in inventory.<br>`;

if (updates.length > 0) {
	actor.updateManyEmbeddedEntities("OwnedItem", updates);
}

ChatMessage.create({
	user: game.user._id,
	speaker: { actor: actor, alias: actor.name },
	content: consumed,
	type: CONST.CHAT_MESSAGE_TYPES.OTHER
});