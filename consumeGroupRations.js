const itemName = "Rations (1 day)";
const amountConsumed = 1;
const party = [
    "Bumble Ratord",
    "Tip Dicard",
    "Bowe'ner"
];
// If any players in the party are not found, do not reduce the party's rations.
// This is to prevent the party rations being reduced unevenly if a member's name is misspelled
let playerNotFound = false;
let playerOutputList = "";
let itemOutputList = "";
let msg = "";


for (let playerName of party) {
    // For each player in the party, check that their name matches up with the name of an actor
    let player = game.actors.getName(playerName);

    if (!player) {
        playerOutputList += "Not found:\t" + playerName + "\n";
        playerNotFound = true;
    } else {
        let item = player.items.find(i => i.name === itemName);
        playerOutputList += "Found: \t\t" + playerName + "\n";

        // Check that each member of the party is carrying rations
        if (!item) {
            itemOutputList += playerName + " is not carrying " + itemName + ".\n";
        } else {
            itemOutputList += item.name + ": " + item.id + "\n";
        }

    }
}

msg = playerOutputList + "\n" + itemOutputList;
console.log(msg);
