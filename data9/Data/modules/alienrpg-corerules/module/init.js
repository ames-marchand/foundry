// import { registerModuleFonts } from './fonts.js';
import { ModuleImportDialog, moduleKey, moduleVersion } from './import.js';
import updateModule from './moduleupdates.js';

// class required by the registerMenu method.
class ImportFormWrapper extends FormApplication {
  render() {
    new ModuleImportDialog().render(true);
  }
}

// Setting Hooks to easily interact with the importing of the compendiums.
Hooks.on('init', () => {
  game.settings.register(moduleKey, 'imported', {
    name: 'Imported Compendiums',
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });
  game.settings.register(moduleKey, 'migrationVersion', {
    name: 'Module Version',
    scope: 'world',
    config: false,
    type: String,
    default: '0',
  });
  game.settings.registerMenu(moduleKey, 'import', {
    name: 'Import Compendiums',
    label: 'Import',
    hint: 'Welcome to the Alien RPG Core Rules.  Click above to import the content to your world.',
    type: ImportFormWrapper,
    restricted: true,
  });
  // registerModuleFonts();
});

// Hook opens Dialog on first launch prompting for import.
Hooks.on('ready', () => {
  if (!game.settings.get(moduleKey, 'imported') && game.user.isGM) {
    game.settings.set(moduleKey, 'migrationVersion', moduleVersion);
    return new ModuleImportDialog().render(true);
  } else {
    updateModule();
  }
});

Hooks.on("renderJournalSheet", (app, html, options) => {
  if ( !isNewerVersion(9, game.version ) ) {
    html.find(".entity-link").addClass("content-link");
  }
});
