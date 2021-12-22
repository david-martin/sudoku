
function getRowOtherValues(row, column) {
    var otherValues = [];
    var rowToCheck = rows[row];
    rowToCheck.forEach((cell, index) => {
        if (index != column && cell[0].innerText != '') {
            otherValues.push(parseInt(cell[0].innerText, 10));
        }
    });

    return otherValues;
}

function getColumnOtherValues(row, column) {
    var otherValues = [];
    rows.forEach((itRow, index) => {
        if (index != row && itRow[column][0].innerText != '') {
            otherValues.push(parseInt(itRow[column][0].innerText));
        }
    });

    return otherValues;
}

function getSquareOtherValues(row, column) {
    var rowStart = (Math.floor(row/3) * 3);
    var rowEnd = rowStart + 2;
    var colStart = (Math.floor(column/3) * 3);
    var colEnd = colStart + 2;
    var otherValues = [];

    while (rowStart <= rowEnd) {
        var colStartIt = colStart;
        while(colStartIt <= colEnd) {
            if (rowStart != row && colStartIt != column) {
                var cell = rows[rowStart][colStartIt];
                if (cell[0].innerText != '') {
                    otherValues.push(parseInt(cell[0].innerText));
                }
            }
            colStartIt++;
        }
        rowStart++;
    }

    return otherValues;
}

function generateValue(otherValues) {
    var nums = [1,2,3,4,5,6,7,8,9],
    j = 0,
    value = 0;

    otherValues.forEach((num) => {
        var index = nums.indexOf(num);
        if (index > -1) {
            nums.splice(index, 1);
        }
    });
    var i = nums.length;
    j = Math.floor(Math.random() * (i));

    ////console.log(nums, i, j, nums[j]);
    return nums[j];
}

function placeValue(target, row, column) {
    ////console.log(row, column, target.innerText);

    var rowOtherValues = getRowOtherValues(row, column);
    ////console.log(rowOtherValues);
    var columnOtherValues = getColumnOtherValues(row, column);
    ////console.log(columnOtherValues);
    var squareOtherValues = getSquareOtherValues(row, column);
    ////console.log(squareOtherValues);

    var allOtherValues = [...new Set(rowOtherValues.concat(columnOtherValues, squareOtherValues))];
    ////console.log(allOtherValues);

    var newCellValue = generateValue(allOtherValues);
    target.innerText = newCellValue;
}
// document.getElementsByTagName('table')[0].addEventListener("click", (ev) => {
//     ////console.log(ev);
//     var target = ev.target;
//     var row = target.parentElement.rowIndex;
//     var column = target.cellIndex;
//     placeValue(target, row, column)
// });

var rows = [];

function buildRows() {
    if (rows.length === 0) {
        // first time so empty grid
        rows = Array.prototype.slice.call(document.getElementsByTagName('tr')).map((row, rowIndex) => {
            var columns = Array.prototype.slice.call(row.getElementsByTagName('td'));
            return columns.map((column, columnIndex) => {
                return [column, [1,2,3,4,5,6,7,8,9]];
            });
        });
    } else {
        rows = Array.prototype.slice.call(document.getElementsByTagName('tr')).map((row, rowIndex) => {
            var columns = Array.prototype.slice.call(row.getElementsByTagName('td'));
            return columns.map((column, columnIndex) => {
                return [column, getPossibleValues(rowIndex, columnIndex)];
            });
        });
    }
}

function fillRandomCell() {
    var randomRow = Math.floor(Math.random() * rows.length);
    var randomColumn = Math.floor(Math.random() * rows.length); // TODO: actually use column length
    fillCell(randomRow, randomColumn);
}

var moves = [];
function fillCell(cellRow, cellColumn) {
    var possibleValues = rows[cellRow][cellColumn][1];
    if (possibleValues.length < 1) {
        console.error('backtrack needed');
    }
    var possibleValueIndex = Math.floor(Math.random() * possibleValues.length);
    var possibleValue = possibleValues[possibleValueIndex];
    // //console.log('filling', cellRow, cellColumn, possibleValue);

    rows[cellRow][cellColumn][0].innerText = possibleValue;
    rows[cellRow][cellColumn][1].splice(possibleValueIndex, 1);
    moves.push([cellRow, cellColumn, possibleValue, possibleValues]);
    //console.log('move:', moves.length, 'filled', cellRow, ',', cellColumn, 'with', possibleValue);
}

function getPossibleValue(row, column) {
    ////console.log(row, column, target.innerText);

    var rowOtherValues = getRowOtherValues(row, column);
    ////console.log(rowOtherValues);
    var columnOtherValues = getColumnOtherValues(row, column);
    ////console.log(columnOtherValues);
    var squareOtherValues = getSquareOtherValues(row, column);
    ////console.log(squareOtherValues);

    var allOtherValues = [...new Set(rowOtherValues.concat(columnOtherValues, squareOtherValues, previouslyRejectedValues))];
    ////console.log(allOtherValues);

    return generateValue(allOtherValues);
}

function getPossibleValues(row, column) {
    if (rows[row][column][0].innerText != '') {
        // already filled
        return [];
    }
    ////console.log(row, column, target.innerText);

    var rowOtherValues = getRowOtherValues(row, column);
    ////console.log(rowOtherValues);
    var columnOtherValues = getColumnOtherValues(row, column);
    ////console.log(columnOtherValues);
    var squareOtherValues = getSquareOtherValues(row, column);
    ////console.log(squareOtherValues);

    var allOtherValues = [...new Set(rowOtherValues.concat(columnOtherValues, squareOtherValues))];
    ////console.log(allOtherValues);
    var nums = [1,2,3,4,5,6,7,8,9],
    j = 0,
    value = 0;

    allOtherValues.forEach((num) => {
        var index = nums.indexOf(num);
        if (index > -1) {
            nums.splice(index, 1);
        }
    });
    return nums;
}

var movesAvailable = true;
function fillCellWithLeastMoves() {
    var cellWithLeastMoves = [];

    rows.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            if (column[1].length > 0) {
                if (cellWithLeastMoves.length == 0 || column[1].length < cellWithLeastMoves[2]) {
                    cellWithLeastMoves = [rowIndex, columnIndex, column[1].length, column[1]];
                }
            }
        });
    });
    
    if (cellWithLeastMoves.length == 0) {
        movesAvailable = false;
        //console.log('no move found');
    } else {
        //console.log('move found for', cellWithLeastMoves[0], ',', cellWithLeastMoves[1], 'out of', cellWithLeastMoves[2], 'possible moves', JSON.stringify(cellWithLeastMoves[3]));
        fillCell(cellWithLeastMoves[0], cellWithLeastMoves[1]);
    }
}

var totalBacktrackLoops = 0;
var numSolutions = 0;
var currentBacktrackLoops = 0;
var maxBacktrackLoops = 0;
buildRows();
fillRandomCell();
buildRows();
solve();

function solve() {
    // setTimeout(() => {
        fillCellWithLeastMoves();
        buildRows();
        if (movesAvailable) {
          solve();
        } else {
            if (isSolved()) {
                numSolutions++;
                //console.log('solved: numSolutions=', numSolutions);
            } else {
                //console.log('failed :(');
            }
            backTrack();
        }
    // }, 50);
}

function isSolved() {
    var foundEmptyCell = false;
    for(var rowIndex = 0;rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];
        for(var columnIndex = 0;columnIndex < row.length; columnIndex++) {
            var column = row[columnIndex];
            if (column[0].innerText == '') {
                foundEmptyCell = true;
                break;
            }
        }
    }
    return !foundEmptyCell;
}

function backTrack() {
    totalBacktrackLoops++;
    currentBacktrackLoops++;
    maxBacktrackLoops = Math.max(maxBacktrackLoops, currentBacktrackLoops);
    if (totalBacktrackLoops > 500) {
        console.log('stopping backtrack at', totalBacktrackLoops, 'loops with', numSolutions, 'solutions and max currentBacktrackLoops', currentBacktrackLoops, 'and maxBacktrackLoops', maxBacktrackLoops);
        return;
    } else if(numSolutions > 1) {
        console.log('stopping backtrack at', totalBacktrackLoops, 'loops with more than 1 solution and max currentBacktrackLoops', currentBacktrackLoops, 'and maxBacktrackLoops', maxBacktrackLoops);
        return;
    }

    //console.log('backtracking', totalBacktrackLoops);
    var lastMove = moves.pop();
    //console.log('lastMove', lastMove);
    if (numSolutions > 0 && lastMove[3].length > 0) {
        // print out all values as a solvable sudoku
        var solvableSudoku = [];
        var numMoves = 0;
        rows.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                if (column[0].innerText != '') {
                    solvableSudoku.push(column[0].innerText);
                } else {
                    solvableSudoku.push("");
                    numMoves++;
                }
            });
        });
        console.log('solvableSudoku in', numMoves, 'moves. PUZZLE:', JSON.stringify(solvableSudoku));
    }

    movesAvailable = true;
    rows[lastMove[0]][lastMove[1]][0].innerText = '';

    if (lastMove[3].length > 0) {
        //console.log('trying to solve again');
        currentBacktrackLoops = 0;
        // have other possible moves. Let's try solve
        rows[lastMove[0]][lastMove[1]][1] = lastMove[3];
        solve();
    } else {
        backTrack();
    }
}