const moduleKey = 'alienrpg-corerules';
const modulePacks = await game.modules.get(moduleKey).packs;
let myLink = [];
for (let p of modulePacks) {
  const pack = await game.packs.get(moduleKey + '.' + p.name).getDocuments();
  for (const [key, JournalEntry] of Object.entries(pack)) {
    myLink.push(p.type + ':' + JournalEntry.name + ' ' + `<a class="entity-link" draggable="false" data-pack="${moduleKey}.${p.name}" data-id="${JournalEntry.id}">${JournalEntry.name}</a>` + '\n');
  }
}
myLink.sort();
let temp = myLink.toString().replace(/,/g, '');
saveDataToFile(temp, 'text/plain', 'myLink.html');
