# Legendary package
## Overview
Install this package to develop games and applications for the Legend platform.
## How to install
Create a new node project, and ins :
```
npm init
npm i legendary
```
## How to initialise ?
### Step 1 : init the entry point
in your main.js/index.j write this following initialization code :
```
const legendary = require("legendary");
legendary.run();
```
Put all your game file in the src folder
### Setup the nevironnement
- Create a src folder:
```
mkdir src
```
- Create `monitor.html` and `controller.html` files in the src folder
- The monitor.html will be displyed on the monitor and the controller.html and the Legend App.
- To add some interactivity between the monitor and the controller include the legend.js library
```
<script src="lib/legend.js">
</script>
```
