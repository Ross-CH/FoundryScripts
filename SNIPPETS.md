# Useful Code Snippets

## Tokens

### HUD

The token HUD is the ring of buttons and input fields around the token, and does not include e.g. token bars/name.
Note that there is a single HUD object that serves all tokens, and is simply moved around/re-rendered as required.

```js
// Access the HUD from a token
const hud = token.hasActiveHUD ? token.layer.hud : null;
```

```js
// Access the HUD from the token layer
const hud = canvas.getLayer("TokenLayer").hud;
```

### Selection

```js
// Deslect all tokens
canvas.tokens.controlled.forEach(it => it.release({}));
```

### Targeting

```js
const targetSet = game.user.targets; // note that this is a `Set`, which can be a pest, so...
const targetArr = [...game.user.targets]; // convert it to an array
```

### Effects (aka Overlays, Status Markers, ...)

```js
// Get current effects
const curEffects = token.data.effects;
```

```js
// Replace current effects with new
const nxtEffects = ["icons/svg/target.svg"];
const tokenUpdate = {effects: nxtEffects};
await token.update(tokenUpdate);
```

```js
// Add to existing effects
const curEffectsSet = new Set([...token.data.effects || []]);
curEffectsSet.add("icons/svg/target.svg");
const nxtEffects = [...curEffectsSet];
const tokenUpdate = {effects: nxtEffects}
await token.update(tokenUpdate);
```

## Rolling

```js
const roll = new Roll("1d20 + 1");
roll.roll(); // Internally roll the dice
roll.total // Use this value
await roll.toMessage(); // Post the roll to chat
```

## Notifications

```js
ui.notifications.info("...")
ui.notifications.warn("...")
ui.notifications.error("...")
```
