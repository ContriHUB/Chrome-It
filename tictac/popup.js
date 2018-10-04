/* JS for Tac, currently tested only with board size of 3x3 cells */
/* Built around the idea that I'll come back later and add functions to support different sized boards */

/////////////////////////////////////////////////////////////////////////
/*                        Global Variables                             */
/////////////////////////////////////////////////////////////////////////

// An object that keeps track of the game
var gamestate;
// Game Constants
var GAME_CONSTANTS = {
    values: { // Player is assumed to be X, for now
        empty: 0,
        x: 1,
        o: -1
    },
    contentClasses: {
        empty: "content_empty",
        x: "content_x",
        o: "content_o"
    }
};
// User specific settings. Load with default values initially
var userSettings = {
    difficulty: "difficult"
};


/////////////////////////////////////////////////////////////////////////
/*                        General Helpers                              */
/////////////////////////////////////////////////////////////////////////

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Generates a standardized error message
function createErrorMessage(callFunc, error) {
    return "Error in " + callFunc + ": " + error;
}

// Parses a cell id in to an object with rows and columns
// Assumes format is 'cell_rowNum_colNum' where rowNum and colNum are integers
function parseId(id) {
    var coordinateString = id.substring(id.indexOf('_') + 1, id.length); // Should be rowNum_colNum
    var rowNum = coordinateString.substring(0, coordinateString.indexOf('_'));
    var colNum = coordinateString.substring(coordinateString.indexOf('_') + 1, coordinateString.length);

    return {
        row: rowNum,
        col: colNum
    };
}

// Constructs a cell Id based on the row and column number of the cell
function constructId (row, col) {
    return "cell_" + row + "_" + col;
}

// Sets the class corresponding to the content of the cell to contentClass
function setContentClass (cellId, contentClass) {
    $("#" + cellId).attr('class',
        function(i, c){
            return c.replace(/(^|\s)content_\S+/g, " " + contentClass);
        });
}

// Gets the numerical sum of all the values in a column
function getColumnValue(col) {
    var sum = 0;
    for (var i = 0; i < gamestate.size; i++) {
        sum += gamestate.board[i][col];
    }
    return sum;
}

// Gets the numerical sum of all the values in a row
function getRowValue(row) {
    var sum = 0;
    for (var j = 0; j < gamestate.size; j++) {
        sum += gamestate.board[row][j];
    }
    return sum;
}

// Gets the numerical sum of all the values in the top left to bottom right diagonal
function getDiagonalValue() {
    var sum = 0;
    for (var i = 0; i < gamestate.size; i++) {
        sum += gamestate.board[i][i];
    }
    return sum;
}

// Gets the numerical sum of all the values in the bottom left to top right diagonal
function getAntiDiagonalValue() {
    var sum = 0;
    for (var i = 0; i < gamestate.size; i++) {
        sum += gamestate.board[i][gamestate.size - 1 - i];
    }
    return sum;
}

// Checks the values of a row/column/diagonal sum to determine if a player has won.
// Returns an object with a flag set if there is a winner and a message of who won.
function checkSum(sum) {
    var output = {
        isWinner: false,
        message: ""
    };

    if (sum == GAME_CONSTANTS.values.x * 3) {
        output.isWinner = true;
        output.message = "You win!";
    } else if (sum == GAME_CONSTANTS.values.o * 3) {
        output.isWinner = true;
        output.message = "Computer wins.";
    }

    return output;
}

// Examines the gamestate.board to see if anyone has one or if there are no more spots left.
// Takes in the row and column of the last move (for efficiency).
// Returns an object with a flag set if there is a winner and a message of who won. If the message is empty the game
// is still active.
function checkGameOver(lastRow, lastCol) {
    // Check current column
    var result = checkSum(getColumnValue(lastCol));
    if (result.isWinner) {
        return result;
    }

    // Check the current row
    result = checkSum(getRowValue(lastRow));
    if (result.isWinner) {
        return result;
    }

    // Check the current diagonal
    if (lastCol === lastRow) {
        // On the diagonal
        result = checkSum(getDiagonalValue());
        if (result.isWinner) {
            return result;
        }
    }

    // Check anti diagonal
    if (lastCol == (gamestate.size - 1) - lastRow) {
        // On the anti diagonal
        result = checkSum(getAntiDiagonalValue());
        if (result.isWinner) {
            return result;
        }
    }

    // Check if its a draw
    var draw = true;
    for (var i = 0; i < gamestate.size && draw; i++) {
        draw = $.inArray(GAME_CONSTANTS.values.empty, gamestate.board[i]) == -1;
    }

    if (draw) {
        return {
            isWinner: false,
            message: "Draw!"
        }
    }

    // This means it's still an active game
    return {
        isWinner: false,
        message: ""
    };
}

// Attempts to make a move, returning true if the move is made, false otherwise. Throws exception if move is impossible
// or playerSymbol is not an X or an O (case insensitive)
function makeMove(row, col, playerSymbol) {
    playerSymbol = playerSymbol.toUpperCase();

    if (row >= gamestate.size || row < 0 || col >= gamestate.size || col < 0) {
        throw createErrorMessage("makeMove", "Improper input: Column=" + col + ", Row=" + row);
    }

    if (playerSymbol !== "O" && playerSymbol !== "X") {
        throw createErrorMessage("makeMove", "Improper input: playerSymbol=" + playerSymbol);
    }

    var cell = $("#" + constructId(row, col))[0];

    if (!cell.innerHTML) {
        cell.innerHTML = playerSymbol;
        setContentClass(cell.id, (playerSymbol === "X" ? GAME_CONSTANTS.contentClasses.x :
                                                         GAME_CONSTANTS.contentClasses.o));
        gamestate.board[row][col] = playerSymbol === "X" ? GAME_CONSTANTS.values.x : GAME_CONSTANTS.values.o;

        return true;
    }

    return false;
}

function resetBoardOfThreeGamestate() {
    gamestate = {
        active: true,
        board: [[0,0,0],[0,0,0],[0,0,0]], // A matrix to represent the board
        playerTurn: true, // Thus, X: true, O: false
        lastMove: { // For the AI to make a move faster
            lastRow: null,
            lastCol: null
        },
        size: 3 // Number of cells in a row/column
    };
}

function resetGame() {
    // TODO: In the future, configure this based on user settings
    // Reset the gamestate
    resetBoardOfThreeGamestate();
    // Reset the board
    $(".cell").each(function() {
        $(this)[0].innerHTML = "";
        setContentClass($(this)[0].id, GAME_CONSTANTS.contentClasses.empty);
    });
}

// Finishes the current game by displaying the game status and resetting the game if they want to play again
function endGame(winnerMessage) {
    $("#game_over_modal").show();
    $("#game_over_message").html(winnerMessage);
    gamestate.active = false;
}

/////////////////////////////////////////////////////////////////////////
/*                        Page Initialization                          */
/////////////////////////////////////////////////////////////////////////

// Generates a 3 x 3 tic tac toe board
function generateBoardOfThree() {
    // Used to generate the grid
    var styles = [["br bb", "bl bb br", "bl bb"],
        ["br bt bb", "br bl bt bb", "bl bt bb"],
        ["br bt", "bl bt br", "bl bt"]];

    for (var i = 0; i < 3; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < 3; j++) {
            var cell = document.createElement("td");
            cell.className = "cell " + GAME_CONSTANTS.contentClasses.empty + " " + styles[i][j];
            cell.id = constructId(i, j);
            row.appendChild(cell);
            cell.addEventListener('click', function(){
                updatePlayerChoice($(this)[0].id);
            });
        }
        $("#tac_board").append(row);
    }

    resetBoardOfThreeGamestate();
}

/////////////////////////////////////////////////////////////////////////
/*                    Main Game Engine Functions                       */
/////////////////////////////////////////////////////////////////////////

function updatePlayerChoice(cellId) {
    var coordinates = parseId(cellId);

    // Attempt to make the move
    if (makeMove(coordinates.row, coordinates.col, "X")) {
        // Check the game status
        processGameStatus(coordinates.row, coordinates.col);
    }
}

function processGameStatus(row, col) {
    var result = checkGameOver(row, col);
    if (result.isWinner || result.message) {
        endGame(result.message);
    } else {
        // Switch whose playerTurn it is
        gamestate.playerTurn = !gamestate.playerTurn;
        // If it's the AI's playerTurn, have them make their move
        if (!gamestate.playerTurn) {
            makeAIMove();
        }
    }
}

function gameStateSave() {
    if (!gamestate.active) {
        resetGame();
    }
    chrome.storage.sync.set({
        gamestate: gamestate
    });
}

function loadUserSettings() {
    chrome.storage.sync.get("difficulty", function (settings) {
        // If the difficulty is not yet set, set it to difficult
        if (!settings.difficulty) {
            chrome.storage.sync.set({
                difficulty: "difficult"
            });
            settings.difficulty = "difficult";
        }
        userSettings.difficulty = settings.difficulty;
    });
}

/////////////////////////////////////////////////////////////////////////
/*                               AI                                    */
/////////////////////////////////////////////////////////////////////////

// Gets all the empty cells on the board
function getAllEmptyCells() {
    var cellsList = [];
    $(".cell").each(function() {
        if (!$(this)[0].innerHTML) {
            cellsList.push($(this)[0]);
        }
    });
    return cellsList;
}

function getEmptyCellColInRow(row) {
    for (var i = 0; i < gamestate.size; i++) {
        if (gamestate.board[row][i] == GAME_CONSTANTS.values.empty) {
            return i;
        }
    }
    return -1;
}

function getEmptyCellRowInCol(col) {
    for (var i = 0; i < gamestate.size; i++) {
        if (gamestate.board[i][col] == GAME_CONSTANTS.values.empty) {
            return i;
        }
    }
    return -1;
}

// Gets the empty cell in the top left to bottom right diagonal, returning its coordinates. Otherwise returns null
function getEmptyCellCoordsInDiag() {
    for (var i = 0; i < gamestate.size; i++) {
        if (gamestate.board[i][i] == GAME_CONSTANTS.values.empty) {
            return { row: i, col: i};
        }
    }
    return null;
}

// Gets the empty cell in the bottom left to top right diagonal, returning its coordinates. Otherwise returns null
function getEmptyCellCoordsInAntiDiag() {
    for (var i = 0; i < gamestate.size; i++) {
        if (gamestate.board[i][gamestate.size - 1 - i] == GAME_CONSTANTS.values.empty) {
            return { row: i, col: gamestate.size - 1 - i};
        }
    }
    return null;
}

function getCorners() {
    var corners = [];
    corners.push({
        row: 0,
        col: 0,
        val: gamestate.board[0][0]
    });
    corners.push({
        row: 0,
        col: gamestate.size - 1,
        val: gamestate.board[0][gamestate.size - 1]
    });
    corners.push({
        row: gamestate.size - 1,
        col: 0,
        val: gamestate.board[gamestate.size - 1][0]
    });
    corners.push({
        row: gamestate.size - 1,
        col: gamestate.size - 1,
        val: gamestate.board[gamestate.size - 1][gamestate.size - 1]
    });
    return corners;
}

// Edges only exist on the 3 x 3 board and are cells that share a border with the middle cell
function getEdges() {
    var edges = [];
    edges.push({
        row: 0,
        col: 1,
        val: gamestate.board[0][1]
    });
    edges.push({
        row: 1,
        col: 0,
        val: gamestate.board[1][0]
    });
    edges.push({
        row: 1,
        col: 2,
        val: gamestate.board[1][2]
    });
    edges.push({
        row: 2,
        col: 1,
        val: gamestate.board[2][1]
    });
    return edges;
}

// Returns the coordinates of a random empty cell in the list cellRowColVals. If there are none, returns null
function getRandomEmptyCellCoords(cellRowColVals) {
    var emptyCells = [];
    for (var i = 0; i < cellRowColVals.length; i++) {
        if (cellRowColVals[i].val == GAME_CONSTANTS.values.empty) {
            emptyCells.push(cellRowColVals[i]);
        }
    }
    if (emptyCells) {
        var rand = getRandomInt(0, emptyCells.length);
        return {
            row: emptyCells[rand].row,
            col: emptyCells[rand].col
        }
    }
    return null;
}

// Gets the number of corner cells the player owns
function getNumPlayerCorners() {
    var sum = 0;
    var corners = getCorners();
    for (var i = 0; i < corners.length; i++) {
        if (corners[i].val == GAME_CONSTANTS.values.x) {
            sum ++;
        }
    }
    return sum;
}

// Gets the coordinates of a random, empty corner on the board. Returns null if no empty corners
function getRandomEmptyCornerCoords() {
    return getRandomEmptyCellCoords(getCorners());
}

// Gets the coordinates of a random, empty edge on the board. Returns null if no such edge exists
function getRandomEmptyEdgeCoords() {
    return getRandomEmptyCellCoords(getEdges());
}

// If the player has two edge spots that both border a corner, return the coords of that corner. Otherwise, return null
function getCornerBetweenAdjescentEdgesCoords() {
    var edges = getEdges();
    var playerEdges = [];
    for (var i = 0; i < edges.length; i++) {
        if (edges[i].val == GAME_CONSTANTS.values.x) {
            playerEdges.push(edges[i]);
        }
    }

    if (playerEdges && playerEdges.length == 2) {
        // We know both edges border the same corner cell if their row's are 1 off from each other
        if (Math.abs(playerEdges[0].row - playerEdges[1].row) == 1) {
            var row = playerEdges[0].row != 1 ? playerEdges[0].row : playerEdges[1].row;
            var col = playerEdges[0].col != 1 ? playerEdges[0].col : playerEdges[1].col;
            return {
                row: row,
                col: col,
                val: gamestate.board[row][col]
            }
        }
    }
    return null;
}

function makeAIMove() {
    var coordinates; // The coordinates of the move
    if (userSettings.difficulty == "easy") {
        // Just move randomly
        coordinates = aIRandomMove();
    } else if (userSettings.difficulty == "normal") {
        // Make the essential move 60% of the time
        if (getRandomInt(0,5) < 3) {
            coordinates = aIEssentialMove();
        }
        if (!coordinates) {
            coordinates = aIRandomMove();
        }
    } else if (userSettings.difficulty == "difficult") {
        // Make any obvious move, otherwise move randomly
        coordinates = aIEssentialMove();
        if (!coordinates) {
            coordinates = aIRandomMove();
        }
    } else if (userSettings.difficulty == "impossible") {
        // Make any obvious move, otherwise make move based off strategy. Leave nothing to chance
        coordinates = aIEssentialMove();
        if (!coordinates) {
            // Strategy limited to 3x3 board with the AI going second
            coordinates = aIBoardOf3SecondMoveStrategy();
        }
    }

    // Resume the game engine
    processGameStatus(coordinates.row, coordinates.col);
}

// Make the AI move on a random, available spot and return the coordinates of that spot
function aIRandomMove() {
    var emptyCells = getAllEmptyCells();
    var coordinates = parseId(emptyCells[getRandomInt(0,emptyCells.length)].id);
    makeMove(coordinates.row, coordinates.col, "O");
    return coordinates;
}

// Make the "essential" or "obvious" move if it exists (winning itself, blocking player win). Returns the coordinates
// of the move, returns null if there's no "essential" move.
// As of now, prioritizes: antidiagonal > diagonal > rightmost columns > rightmost rows
function aIEssentialMove() {
    // TODO: Modify for efficiency, exiting the process once a win coordinate has been found
    // TODO: Shorten by refactoring

    var winCoords = { row: -1, col: -1};
    var blockCoords = { row: -1, col: -1};

    // Search the rows/cols for a win/block move
    for (var i = 0; i < gamestate.size; i++) {
        var rowValue = getRowValue(i);
        var colValue = getColumnValue(i);

        if (rowValue == (gamestate.size - 1) * GAME_CONSTANTS.values.o) {
            winCoords.row = i;
            winCoords.col = getEmptyCellColInRow(i);
        } else if (rowValue == (gamestate.size - 1) * GAME_CONSTANTS.values.x) {
            blockCoords.row = i;
            blockCoords.col = getEmptyCellColInRow(i);
        }

        if (colValue == (gamestate.size - 1) * GAME_CONSTANTS.values.o) {
            winCoords.row = getEmptyCellRowInCol(i);
            winCoords.col = i;
        } else if (colValue == (gamestate.size - 1) * GAME_CONSTANTS.values.x) {
            blockCoords.row = getEmptyCellRowInCol(i);
            blockCoords.col = i;
        }
    }

    // Search the diagonal
    var diagValue = getDiagonalValue();
    if (diagValue == (gamestate.size - 1) * GAME_CONSTANTS.values.o) {
        winCoords = getEmptyCellCoordsInDiag();
    } else if (diagValue == (gamestate.size - 1) * GAME_CONSTANTS.values.x) {
        blockCoords = getEmptyCellCoordsInDiag();
    }

    // Search the anti diagonal
    var antiDiagValue = getAntiDiagonalValue();
    if (antiDiagValue == (gamestate.size - 1) * GAME_CONSTANTS.values.o) {
        winCoords = getEmptyCellCoordsInAntiDiag();
    } else if (antiDiagValue == (gamestate.size - 1) * GAME_CONSTANTS.values.x) {
        blockCoords = getEmptyCellCoordsInAntiDiag();
    }

    // Examine the results, prioritizing winning over blocking
    if (winCoords.row != -1 && winCoords.col != -1) {
        makeMove(winCoords.row, winCoords.col, "O");
        return winCoords;
    }

    if (blockCoords.row != -1 && blockCoords.col != -1) {
        makeMove(blockCoords.row, blockCoords.col, "O");
        return blockCoords;
    }

    return null;
}

// Uses strategy to make the best move possible assuming the board is 3 x 3 and the AI goes after the player
// More designed towards never losing than always winning, since the person going first has the advantage
// Assumes the obvious move (win or block the players win) does not exist
/*
    Strategy

     - If it's the AI's first move...
        * If the player takes the middle spot, take a corner
        * If the player takes a corner, take the middle
        * If the player takes an edge (cell bordering middle cell), take the middle
     - Otherwise...
        * If the player has taken the middle and the corner opposite the one the AI took, take another corner
        * If the player has two corners, take a random edge (assumes we have the middle spot)
        * If the player has taken adjacent edges, take the corner between them
        * Move randomly TODO: Fill this in with an offensive strategy
 */
function aIBoardOf3SecondMoveStrategy() {
    if (gamestate.size != 3) {
        throw "Improper AI strategy has been selected";
    }

    var moveCoords;

    // If this is the first AI move
    if (getAllEmptyCells().length == (gamestate.size * gamestate.size) - 1) {
        if (gamestate.board[1][1] == GAME_CONSTANTS.values.x) {
            moveCoords = getRandomEmptyCornerCoords();
        } else {
            moveCoords = {
                row: 1,
                col: 1
            }
        }
    } else {
        var numPlayerCorners = getNumPlayerCorners();
        if (gamestate.board[1][1] == GAME_CONSTANTS.values.x && numPlayerCorners == 1) {
            moveCoords = getRandomEmptyCornerCoords();
        } else if(numPlayerCorners == 2) {
            moveCoords = getRandomEmptyEdgeCoords();
        } else {
            var corner = getCornerBetweenAdjescentEdgesCoords();
            if (corner && corner.val == GAME_CONSTANTS.values.empty) {
                moveCoords = {
                    row: corner.row,
                    col: corner.col
                }
            } else {
                moveCoords = aIRandomMove();
            }
        }
    }

    makeMove(moveCoords.row, moveCoords.col, "o");
    return moveCoords;
}

/////////////////////////////////////////////////////////////////////////
/*                           Run On Eval                               */
/////////////////////////////////////////////////////////////////////////

/* Failing code for saving only on the popup's close
 var port = chrome.runtime.connect({name: "TacCloseDetector"});

 port.onDisconnect = gameStateSave;
 */
loadUserSettings();
generateBoardOfThree();

// Attach event handlers
$("#options_button").on('click', function() {
    document.location.href = "options.html";
});

$("#btn_play_again").on('click', function() {
    $("#game_over_modal").hide();
    resetGame();
});

$("#btn_end_game").on('click', function() {
    $("#game_over_modal").hide();
});
$("#btn_options_back_main").on('click', function() {
    document.location.href = "../popup.html";
});