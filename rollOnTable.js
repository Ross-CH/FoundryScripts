// An equivalent for Roll20's `/roll 1t[tablename]` syntax
const name = "Foo"; // Edit the name as required (case-insensitive)
const table = RollTable.collection.find(it => it.name.toLowerCase().trim() === name.toLowerCase().trim());
table.draw();
