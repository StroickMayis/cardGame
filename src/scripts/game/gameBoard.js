// /*

// DOCUMENTATION:

// Desc: Intended for generic use for games requiring a grid with objects interacting on it, but is design primarily for my card game, Warhammer Fantasy: Tactics.
//         Will create grids of any size with structural support for different kinds of tiles, movement, and placements on the board for units.

// TODO: Grid Creation | Tile Creation | Tile Assignment Tool | Traversal Tools |

// */

// const isPosInteger = (input) => {
//     if(Number.isInteger(input)) {
//         if(input > 0) {
//             return true;
//         } else {
//             return false;
//         }
//     } else {
//         return false;
//     }
// }

// const createGameBoard = () => {
//     return {
//         help: function () { // ! Should eventually add a help command here for users that don't know how to create custom tiles or what the commands are. 

//         },
//         config: {
//             isLoggerActive: true,
//         },
//         logger: {
    
//         },
//         tile: { 
//             config: { // Contains configurations for how the tiles of this gameBoard should function.
                
//             },
//             types: {
//                 emptyTile: {
//                     displayIcon: `-`,
//                     // ! Keep in mind that I want to use this for WarHelm AND the card game, so make it general purpose, but not too much... (; 
//                 }
//             },
//             createType: function () { // Adds a user defined tileType to the tileTypes object (which functions as a list).
//                 // ! This one will be tricky, because a lot of game logic will be built onto this.
//                 // ! Solution to this currently is that I will modularly make tile logic packages for the program. This func will accept them to create tiles that will use those functionalities.
                
//             },
//             fill: function () { // Will fill every tileable space on the gameBoard with a specified tileType as directed by the user.
                
//             },
//             place: function () { // Will place a tile of a specific type in a tileable spot on the gameBoard as directed by the user.
                
//             },
//         },
//         createGrid: function (gridSizeX, gridSizeY) { // simply creates a 2D array. 
//             if(isPosInteger(gridSizeX) && isPosInteger(gridSizeY)) {
//                 const array = new Array(gridSizeX);

//                 for(let i = 0; i < array.length; i++) {
//                     let newArray = new Array(gridSizeY);
//                     newArray.fill()
//                     array[i] = newArray;
//                 }
//                 return array;
//             } else {
//                 console.log(`Error: An invalid arg has been entered to createGrid(), this function only accepts positive integer numbers as args.`)
//                 return null;
//             }
//         },
//         displayGrid: function (grid) { // prints a visualization of a 2D array to the console.
//             if(Array.isArray(grid) && Array.isArray(grid[0])) {
//                 console.log(`-`); // ! need to make hyphens dynamic to size, although the whole thing will be dynamic anyway to do data string length variation in the arrays.
//                 for(let y = grid[0].length; y > 0; y--) {
//                     let rowString = `|`
//                     for(let x = 0; x < grid.length; x++) {
//                         rowString += ` ${grid[x][y]} |`;
//                     }
//                     console.log(rowString);
//                     console.log(`-`);
//                 }
    
//             } else {
//                 console.log(`Error: An invalid arg has been entered to displayGrid(), this function only accepts 2D arrays as args.`)
//                 return null;
//             }
//         },
//     }
// }



// export { createGameBoard } ;

// ! Below is GROK 3

// Utility to check positive integers
const isPosInteger = (input) => Number.isInteger(input) && input > 0;

// Game board factory function
const createGameBoard = () => {
    const board = {
        // User guidance
        help: function () {
            console.log("Available methods: createGrid, displayGrid, tile.createType, tile.fill, tile.place");
            console.log("Tile types: emptyTile (default)");
            console.log("Use tile.createType(name, properties) to add custom tiles.");
        },
        config: {
            isLoggerActive: true,
        },
        logger: {
            log: function (message) {
                if (board.config.isLoggerActive) console.log(`[LOG] ${message}`);
            },
        },
        state: {
            grid: null, // 2D grid storage
            units: [],  // Track units (expand as needed)
        },
        tile: {
            config: {}, // Tile-specific settings
            types: {
                emptyTile: {
                    displayIcon: `-`,
                    isMoveable: false,
                    isOccupied: false,
                },
            },
            // Add a new tile type with properties
            createType: function (name, properties) {
                if (this.types[name]) throw new Error(`Tile type "${name}" already exists.`);
                this.types[name] = { ...properties };
                board.logger.log(`Created tile type: ${name}`);
            },
            // Fill grid with a tile type
            fill: function (tileType) {
                if (!board.state.grid) throw new Error("Grid not initialized. Call createGrid first.");
                if (!this.types[tileType]) throw new Error(`Tile type "${tileType}" does not exist.`);
                for (let x = 0; x < board.state.grid.length; x++) {
                    for (let y = 0; y < board.state.grid[0].length; y++) {
                        board.state.grid[x][y] = tileType;
                    }
                }
                board.logger.log(`Grid filled with "${tileType}" tiles.`);
            },
            // Place a tile with validation
            place: function (x, y, tileType) {
                if (!board.state.grid) throw new Error("Grid not initialized. Call createGrid first.");
                if (!isPosInteger(x) || !isPosInteger(y) || x >= board.state.grid.length || y >= board.state.grid[0].length) {
                    throw new Error(`Invalid coordinates: (${x}, ${y})`);
                }
                if (!this.types[tileType]) throw new Error(`Tile type "${tileType}" does not exist.`);
                if (this.types[board.state.grid[x][y]].isOccupied) {
                    throw new Error(`Tile at (${x}, ${y}) is already occupied.`);
                }
                board.state.grid[x][y] = tileType;
                board.logger.log(`Placed "${tileType}" at (${x}, ${y})`);
            },
        },
        // Create and initialize grid
        createGrid: function (gridSizeX, gridSizeY) {
            if (!isPosInteger(gridSizeX) || !isPosInteger(gridSizeY)) {
                throw new Error("Grid sizes must be positive integers.");
            }
            this.state.grid = Array.from({ length: gridSizeX }, () =>
                Array(gridSizeY).fill("emptyTile")
            );
            this.logger.log(`Grid created: ${gridSizeX}x${gridSizeY}`);
        },
        // Display grid with dynamic formatting
        displayGrid: function () {
            if (!this.state.grid) throw new Error("Grid not initialized. Call createGrid first.");
            const grid = this.state.grid;
            const maxIconLength = Math.max(...Object.values(this.tile.types).map(t => t.displayIcon.length));
            const separator = "-".repeat((maxIconLength + 2) * grid.length + 1);
            console.log(separator);
            for (let y = grid[0].length - 1; y >= 0; y--) {
                let rowString = "|";
                for (let x = 0; x < grid.length; x++) {
                    const tile = this.tile.types[grid[x][y]];
                    const icon = tile.displayIcon.padEnd(maxIconLength, " ");
                    rowString += ` ${icon} |`;
                }
                console.log(rowString);
                console.log(separator);
            }
        },
    };
    return board;
};

export { createGameBoard };