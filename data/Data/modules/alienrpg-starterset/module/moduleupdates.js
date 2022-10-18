import { moduleKey } from './import.js';

export default async function checkModuleUpdate() {
  const packageManifest = 'manifest.json';
  const manifest = await readManifest(packageManifest);
  const modulePacks = await game.modules.get(moduleKey).packs;
  // const moduleVersion = '2.0.4';
  const moduleVersion = game.modules.get(moduleKey).data.version;
  let imported = {
    Actor: {},
    Item: {},
    JournalEntry: {},
    RollTable: {},
    Scene: {},
  };

  const worldVersion = game.settings.get(moduleKey, 'migrationVersion');
  const changelog = async () => {
    const r = await fetch(`modules/${moduleKey}/manifests/changelog.html`);
    return r.text();
  };
  if (moduleVersion > worldVersion) {
    changelog().then((res) => {
      Dialog.prompt({
        title: `${moduleVersion} Release Notes`,
        content: res,
        label: 'Ok!',
        callback: async () => {
          await CleanUp();
          await moduleUpdate();
        },
      });
    });
  }

  async function moduleUpdate() {
    console.warn('Core Rules Patch required');
    /**
     * updateData parameters.
     * Param for number of dice to roll for each die type/rolls
     * @param {Text} assetType - Type of asset journal, scenes, actors, items
     * @param {Text} oldAsset - Name of the asset you want removed
     * @param {Text} newAsset - Name of the asset you want replaced
     * @param {Text} packName - Name of the pack (from the module.js)
     * @param {Text} folder - Name of the folder to put the asset in
     * */
    const updateData = [
      { assetType: 'tables', oldAsset: 'Critical injuries', newAsset: 'Critical injuries', packName: 'alienrpg-ss-tables-tables', folder: 'Alien Mother Tables' },
      { assetType: 'tables', oldAsset: 'Critical Injuries on Synthetics', newAsset: 'Critical Injuries on Synthetics', packName: 'alienrpg-ss-tables-tables', folder: 'Alien Mother Tables' },
      { assetType: 'journal', oldAsset: '04. USCSS MONTERO', newAsset: '04. USCSS MONTERO', packName: 'alienrpg-ss-cotg-scenario-journal', folder: '1. CotG Scenario' },
      { assetType: 'folders', oldAsset: 'Alien RPG Starter Set Rules', newAsset: 'N/A', packName: 'N/A', folder: 'Alien RPG Starter Set Rules' },

      // { assetType: 'scenes', oldAsset: 'Cronus Deck A', newAsset: 'Cronus Deck A', packName: 'alienrpg-ss-cotg-maps-scenes', folder: 'Alien RPG Chariot of the Gods - Maps' },
      // { assetType: 'scenes', oldAsset: 'Cronus Deck B', newAsset: 'Cronus Deck B', packName: 'alienrpg-ss-cotg-maps-scenes', folder: 'Alien RPG Chariot of the Gods - Maps' },
      // { assetType: 'scenes', oldAsset: 'Cronus Deck C', newAsset: 'Cronus Deck C', packName: 'alienrpg-ss-cotg-maps-scenes', folder: 'Alien RPG Chariot of the Gods - Maps' },
      // { assetType: 'actors', oldAsset: 'Adult (Stage V Neomorph)', newAsset: 'Adult (Stage V Neomorph)', packName: 'alienrpg-ss-cotg-actors-actors', folder: `Alien RPG CotG Creatures` },
      // { assetType: 'folders', oldAsset: 'Chariot Of the Gods - Scenario', newAsset: 'N/A', packName: 'N/A', folder: 'Chariot Of the Gods - Scenario' },
    ];
    const moduleUpdateNameDict = {
      'Alien RPG Mother Aids': 'skipimport',
      'Alien RPG Armor': 'skipimport',
      'Alien RPG Equipment': 'skipimport',
      'Alien RPG Weapons': 'skipimport',
      'Alien RPG Vehicle Weapons': 'skipimport',
      'Alien RPG Talents(Career)': 'skipimport',
      'The Art of Alien': 'skipimport',
      'Alien Tables': 'Alien Tables',
      'Alien RPG CotG - Agendas': 'skipimport',
      'Alien RPG Sub-Entries': 'skipimport',
      'Chariot Of the Gods - Scenario': 'Chariot Of the Gods - Scenario',
      'Chariot of the Gods - Actors': 'skipimport',
      'Alien RPG Chariot of the Gods - Maps': 'skipimport',
      'Alien RPG Starter Set Rules': 'Alien RPG Starter Set Rules',
    };

    let pack = {};
    let entry = '';
    let folderId = 0;

    for (const [key, { assetType, oldAsset, newAsset, packName, folder }] of Object.entries(updateData)) {
      // debugger;
      switch (assetType) {
        case 'journal':
        case 'items':
        case 'actors':
        case 'tables':
          try {
            const isThere = game[assetType].getName(oldAsset);
            if (isThere) await isThere.delete({ deleteSubfolders: true, deleteContents: true });
          } catch (error) {
            console.warn(`${oldAsset} already deleted`);
          }
          pack = await game.packs.find((p) => p.metadata.name === packName);
          await pack.getIndex();
          entry = pack.index.find((j) => j.name === newAsset);
          folderId = await game.folders.getName(folder).id;
          await game[assetType].importFromCompendium(pack, entry._id, { folder: folderId, keepId: true });
          break;

        case 'scenes':
          let isActive = game.scenes.getName(newAsset)?.active || false;
          let hasTokens = game.scenes.getName(newAsset)?.data.tokens.length || false;
          let hasNotes = game.scenes.getName(newAsset)?.data.notes.length || false;
          let hasLights = game.scenes.getName(newAsset)?.data.lights.length || false;
          if (isActive || hasTokens || hasNotes || hasLights) {
            let chatMessage = `<div class="chatBG">`;
            chatMessage += `<h2 style="color:  #fff">The scene: <br> ${newAsset} <br> has not been imported as:</h2> `;
            if (isActive) chatMessage += 'It is Active and in use.<br>';
            if (hasTokens) chatMessage += `It has ${hasTokens} placed Tokens.<br>`;
            if (hasNotes) chatMessage += `It has ${hasNotes} placed Notes.<br>`;
            if (hasLights) chatMessage += `It has ${hasLights} placed Lights sources. <br>`;
            chatMessage += '<br><h3>Import the new version manually from the Compendium when convenient.</h3> ';
            ChatMessage.create({
              user: game.user.data._id,
              content: chatMessage,
              whisper: game.users.contents.filter((u) => u.isGM).map((u) => u.data._id),
              rollMode: game.settings.get('core', 'rollMode'),
            });
            break;
          } else {
            try {
              const scene = game.scenes.getName(oldAsset);
              if (scene) await scene.delete({ deleteSubfolders: true, deleteContents: true });
            } catch (error) {
              console.warn(`${newAsset} already deleted`);
            }
            pack = await game.packs.find((p) => p.metadata.name === packName);
            await pack.getIndex();
            entry = pack.index.find((j) => j.name === newAsset);
            folderId = await game.folders.getName(folder).id;
            await game.scenes.importFromCompendium(pack, entry._id, { folder: folderId, keepId: true });
          }
          break;
        case 'folders':
          try {
            const isThere = game[assetType].getName(oldAsset);
            // if (isThere) await isThere.delete();
            if (isThere) {
              console.log('It Exists');
              await isThere.delete({ deleteSubfolders: true, deleteContents: true });
            }
          } catch (error) {
            console.warn(`${oldAsset} already deleted`);
          }
          await importModule(manifest, modulePacks, moduleUpdateNameDict);
          break;
        default:
          break;
      }
    }
    await allDone();
  }

  async function importModule(manifest, modulePacks, moduleFolderNameDict) {
    return Promise.all(
      modulePacks.map(async (p) => {
        let moduleFolderId = '';
        let type ='';
        const pack = await game.packs.get(moduleKey + '.' + p.name).getDocuments();
        if (isNewerVersion(game.version,"0.8.9")){
          type = p.type;
        } else {
          type = p.entity;
        }
        if (type !== 'Playlist' && type !== 'Macro') {
          const moduleFolderName = moduleFolderNameDict[p.label];
          if (moduleFolderName === 'skipimport') {
            return;
          }
          if (game.folders.getName(moduleFolderName)) {
            moduleFolderId = game.folders.getName(moduleFolderName);
          } else {
            moduleFolderId = await Folder.create({
              name: moduleFolderName,
              type: type,
              parent: null,
              color: manifest[type][moduleFolderName].color || null,
              sort: manifest[type][moduleFolderName].sort || null,
              sorting: manifest[type][moduleFolderName].sorting || 'a',
            });
          }
          // debugger;
          const manifestEntity = manifest[type][moduleFolderName].content;
          // for (let x in manifestEntity) {
          //   if (game.folders.getName(x)) {
          //     delete manifestEntity[x];
          //   }
          // }
          await importFromManifest(manifestEntity, pack, type, moduleFolderId.data._id);
        } else if (type === 'Playlist') {
          const uniquePlaylists = pack.filter((p) => {
            if (!game.playlists.find((n) => n.data.name === p.data.name)) return p;
          });
          Playlist.create(uniquePlaylists.map((p) => p.data));
        } else {
          const uniqueMacros = pack.filter((p) => {
            if (!game.macros.find((n) => n.data.name === p.data.name)) return p;
          });
          Macro.create(uniqueMacros.map((p) => p.data));
        }
        return true;
      })
    );
  }

  async function importFromManifest(manifest, pack, type, parent) {
    let folder = ';';
    if (manifest.parent) {
      parent = manifest.parent;
      delete manifest.parent;
    }
    for await (const [key, item] of Object.entries(manifest)) {
      if (key !== 'entities') {
        if (game.folders.getName(key)) {
          folder = game.folders.getName(key);
        } else {
          folder = await Folder.create({
            name: key,
            type: type,
            color: item.color,
            parent: parent || null,
            sort: item.sort || null,
            sorting: item.sorting || 'a',
          });
        }
        const pushParent = Object.values(item);
        await pushParent.forEach((child) => {
          if (child && typeof child === 'object') child.parent = folder.data._id;
        });
        await importFromManifest(item.content, pack, type);
      } else if (key === 'entities') {
        try {
          // debugger;
          const entityData = Object.keys(item).reduce((result, identifier) => {
            const entity = pack.filter((e) => e.data._id === identifier);
            return [...result, entity[0].data];
          }, []);

          for (let index = entityData.length - 1; index >= 0; index--) {
            let x = entityData[index];
            let fred = x.document.collectionName;
            let itsMe = x.name;
            if (game[fred].getName(itsMe) != undefined) {
              console.log(x.name, ' Exists', fred);
              delete entityData[index];
            }
          }
          let newentityData = entityData.filter(() => true);

          for await (const entry of newentityData) {
            entry._source.folder = parent || null;
          }

          const cls = getDocumentClass(type);
          const createdEntities = await cls.createDocuments(newentityData, { keepId: true });
          if (Array.isArray(createdEntities)) {
            for await (const entry of createdEntities) {
              imported[type][entry.data.name] = entry;
            }
          } else {
            imported[type][createdEntities.data.name] = createdEntities;
          }
        } catch (e) {
          console.warn('Could not create entity: ', e);
        }
      } else {
        console.error("I don't understand this key: ", key);
      }
    }
  }

  async function readManifest(manifestName) {
    const r = await (await fetch(`modules/${moduleKey}/manifests/${manifestName}`))
      .json()
      .catch((e) => console.warn('MANIFEST ERROR: \nYou likely have nothing in your manifest, or it may be improperly formatted.', e));
    return r;
  }

  async function allDone() {
    await game.settings.set(moduleKey, 'migrationVersion', game.modules.get(moduleKey).data.version);
    Dialog.prompt({
      title: `Alien Starter Set Update`,
      content: '<p>The update has completed.</p>',
      label: 'Okay!',
      callback: () => {
        console.log('All Done');
      },
    });
  }
  async function CleanUp() {
    // One of clean up for 2.0.3 release    -----    REMOVE ON NEXT RELEASE
    let startSet = '';
    startSet = game.journal.getName('STARTER SET RULES INDEX');
    if (startSet) await startSet.delete();
    startSet = game.journal.getName('STARTER SET - HOW TO USE THIS MODULE');
    if (startSet) await startSet.delete();
    startSet = game.journal.getName('Alien RPG Starter Set Credits');
    if (startSet) await startSet.delete();
    startSet = game.journal.getName('CHARIOT OF THE GODS - SCENARIO INDEX');
    if (startSet) await startSet.delete();
    // One of clean up for 2.0.3 release    -----    REMOVE ON NEXT RELEASE
  }
}
