const MODULE_ID = "{{MODULE_ID}}";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initialising`);

  game.settings.register(MODULE_ID, "exampleSetting", {
    name: `${MODULE_ID}.settings.example.name`,
    hint: `${MODULE_ID}.settings.example.hint`,
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Ready`);
  ui.notifications.info(game.i18n.localize(`${MODULE_ID}.ready`));
});
