// Utility to check positive integers
const isPosInteger = (input) => Number.isInteger(input) && input > 0;

// Game board factory function
const createGameBoard = () => {
    const board = {
        // User guidance
        help: function () {
            board.logger.log("[HELP] Available methods: createGrid, displayGrid, tile.createType, tile.fill, tile.place");
            board.logger.log("[HELP] Tile types: emptyTile (default)");
            board.logger.log("[HELP] Use tile.createType(name, properties) to add custom tiles.");
        },
        config: {
            isLoggerActive: true,
        },
        logger: {
            log: function (message) {
                if (board.config.isLoggerActive) console.log(`[GAMEBOARD] ${message}`);
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
            const grid = this.state.grid;
            const maxIconLength = Math.max(...Object.values(this.tile.types).map(t => t.displayIcon.length));
            const separator = "-".repeat((maxIconLength + 2) * grid.length + 7);
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