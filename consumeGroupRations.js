const itemName = "Rations (1 day)";
const itemNameSimple = "Ration" // This is purely for display purposes
const amountConsumed = 1;
const partyNames = [
    "Bumble Ratord",
    "Tip Dicard",
    "Bowe'ner"
];
let party = [];
// If any actors in the party are not found, do not reduce the party's rations.
// This is to prevent the party rations being reduced unevenly if a member's name is misspelled
let playerOrItemNotFound = false;
let errorList = `<h3>Error:</h3><ul>`;
let chatMsg = `<h2>Eat Rations x${amountConsumed}</h2><ul>`;

console.clear();

// For each actor in the party, check that their name matches up with the name of an actor
for (let actorName of partyNames) {
    let actor = game.actors.getName(actorName);

    // If an actor is found, add them to the list of confirmed a, otherwise produce an error and add it to the error list
    if (actor) {
        party.push(actor);
    } else {
        errorList += `<li>Actor not found: ${actorName}</li>`
        playerOrItemNotFound = true;
    }
}

// Check each party member has the selected item recorded in their inventory
for (let actor of party) {
    let item = actor.items.find(i => i.name === itemName);
    if (!item) {
        errorList += `<li>${actor.name} is not carrying ${itemName}`
        playerOrItemNotFound = true;
    }
}
errorList += `</ul>`;

if (!playerOrItemNotFound) {
    for (let actor of party) {
        let item = actor.items.find(i => i.name === itemName);

        // If the actor has enough of the selected item,
        // decrement the quantity of the actor's selected item by the chosen amount
        if (item.data.data.quantity >= amountConsumed) {
            item.data.data.quantity -= amountConsumed;
            chatMsg += `<li>${actor.name}: ${item.data.data.quantity} left.</li>\n`
        } else {
            chatMsg += `<li>${actor.name}: Not enough ${itemNameSimple.length ? itemNameSimple : itemName}s. ${item.data.data.quantity} left.</li>`
        }
    }
    chatMsg += `</ul>`;
} else {
    chatMsg += errorList;
}

ChatMessage.create({content: chatMsg})