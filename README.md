# FoundryScripts

#### Foundry Types

See [here](https://gitlab.com/foundry-projects/foundry-pc/foundry-pc-types).

#### Tips and Tricks

- `await` cannot be used in the root scope of a macro. This can be circumvented by wrapping your macro code in:
    ```js
    (async () => { 
        /* Your code here */ 
    })();
    ```

#### Referenced Modules

Macros may reference APIs not present in Foundry by default. These may include:

- [BetterRolls](https://github.com/RedReign/FoundryVTT-BetterRolls5e/tree/master/betterrolls5e/scripts)
