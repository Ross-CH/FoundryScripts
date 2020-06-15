# Rolling

Foundry has a simple roll variable syntax, which is as follows ([original docs](https://foundryvtt.com/article/dice/)):

> You may also include variable terms in your rolled expressions. These variable terms use the syntax @{data.path} which are evaluated using attributes from the data of your currently controlled Actor. The composition of this data depends on the game system you are using, but as an example, the following roll would add the "Strength modifier" in the D&D5E system.
>
> `/roll 1d6 + @abilities.str.mod`

#### Proficiency and Modifiers

There are two special variables available in the dnd5e system, these are:

- `@mod` An ability score modifier associated with the thing being rolled (usually a sheet item), taken from `<item>.abilityMod`
- `@prof` The proficiency bonus of the currently controlled Actor.

#### Items

When rolling a sheet item, the item's data is accessible as:
```
@item.<...data path>
```

##### Class Levels

Additionally, for dnd5e Actors, the following special variable namespace exist:
```
@class.<sluggified class name>.<...data path>
```

For example, `@class.rogue.levels` could be used to add sneak attack damage with the following roll expression:
```
+(ceil(@classes.rogue.levels / 2))d6
```
