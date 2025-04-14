import "../index.css"; 
import { createGameBoard } from "./game/gameBoard";

// I am going to make a central command object that controls and communicates with all of the other units. 
// Central command will be in charge of delivering state to its functional units to manipulate or work with.

let mainBoard = createGameBoard();
mainBoard.help();
mainBoard.createGrid(6, 8);
mainBoard.displayGrid()


// ! Leaving off here, considering making this a Civilization-like game. Screw the card shit. It just doesn't need to be like that. 

