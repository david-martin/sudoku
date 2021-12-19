
function checkForWin() {
    // Build up an array of arrays with cell values. 0 if empty.
    // Each array entry is a row with a nested array for each cell.
    var rows = Array.prototype.slice.call(document.getElementsByTagName('tr'));
    var rowValues = rows.map((row) => {
        var cells = Array.prototype.slice.call(row.getElementsByTagName('td'));
        var cellValues = cells.map((cell) => {
            return parseInt(cell.innerText, 10) || 0;
        });
        return cellValues;
    });
    
    // check each row adds up to the right number e.g. 45 for a 9x9 sudoku
    var expectedSum = rowValues.length * ((rowValues.length + 1) / 2);
    var rowSumMatches = rowValues.map((row) => {
        var sum = row.reduce((a, b) => a + b, 0)
        return sum === expectedSum;
    });
    //console.log(rowSumMatches);

    // check each column adds up to the right number e.g. 45 for a 9x9 sudoku
}

function generateValues(ranNums) {
    var nums = [1,2,3,4,5,6,7,8,9],
    j = 0;

    ranNums.forEach((num) => {
        var index = nums.indexOf(num);
        if (index > -1) {
            nums.splice(index, 1);
        }
    });
    var i = nums.length;

    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        ranNums.push(nums[j]);
        nums.splice(j,1);
    }
}

function fillGrid() {
    var rows = Array.prototype.slice.call(document.getElementsByTagName('tr'));
    var rowValues = rows.map((row) => {
        var cells = Array.prototype.slice.call(row.getElementsByTagName('td'));
        var cellValues = cells.map((cell) => {
            return 0;
        });
        return cellValues;
    });

    // first row
    var row1values = [];
    generateValues(row1values);
    rowValues[0] = row1values;

    // first square
    var square1values = [rowValues[0][0], rowValues[0][1], rowValues[0][2]];
    generateValues(square1values);
    rowValues[1][0] = square1values[3];
    rowValues[1][1] = square1values[4];
    rowValues[1][2] = square1values[5];
    rowValues[2][0] = square1values[6];
    rowValues[2][1] = square1values[7];
    rowValues[2][2] = square1values[8];

    // second square, row 2
    var square2row2values = [...new Set([rowValues[0][3], rowValues[0][4], rowValues[0][5], rowValues[1][0], rowValues[1][1], rowValues[1][2]])];
    generateValues(square2row2values);
    rowValues[1][3] = square2row2values[6];
    rowValues[1][4] = square2row2values[7];
    rowValues[1][5] = square2row2values[8];

    // third square, row 2
    var square3row2values = [...new Set([rowValues[0][6], rowValues[0][7], rowValues[0][8], rowValues[1][0], rowValues[1][1], rowValues[1][2], rowValues[1][3], rowValues[1][4], rowValues[1][5]])];
    generateValues(square3row2values);
    rowValues[1][6] = square3row2values[6];
    rowValues[1][7] = square3row2values[7];
    rowValues[1][8] = square3row2values[8];

    return rowValues;
}

var rows = Array.prototype.slice.call(document.getElementsByTagName('tr')).map((row) => {
    var cells = Array.prototype.slice.call(row.getElementsByTagName('td'));
    return cells.map((cell) => {
        return cell;
    });
});

function getRowOtherValues(row, column) {
    var otherValues = [];
    var rowToCheck = rows[row];
    rowToCheck.forEach((cell, index) => {
        if (index != column && cell.innerText != '') {
            otherValues.push(parseInt(cell.innerText, 10));
        }
    });

    return otherValues;
}

function getColumnOtherValues(row, column) {
    var otherValues = [];
    rows.forEach((itRow, index) => {
        if (index != row && itRow[column].innerText != '') {
            otherValues.push(parseInt(itRow[column].innerText));
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
                if (cell.innerText != '') {
                    otherValues.push(parseInt(cell.innerText));
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

    //console.log(nums, i, j, nums[j]);
    return nums[j];
}

function placeValue(target, row, column) {
    //console.log(row, column, target.innerText);

    var rowOtherValues = getRowOtherValues(row, column);
    //console.log(rowOtherValues);
    var columnOtherValues = getColumnOtherValues(row, column);
    //console.log(columnOtherValues);
    var squareOtherValues = getSquareOtherValues(row, column);
    //console.log(squareOtherValues);

    var allOtherValues = [...new Set(rowOtherValues.concat(columnOtherValues, squareOtherValues))];
    //console.log(allOtherValues);

    var newCellValue = generateValue(allOtherValues);
    if (newCellValue == undefined) {
        hasUndefined = true;
    }
    target.innerText = newCellValue;
}
// document.getElementsByTagName('table')[0].addEventListener("click", (ev) => {
//     //console.log(ev);
//     var target = ev.target;
//     var row = target.parentElement.rowIndex;
//     var column = target.cellIndex;
//     placeValue(target, row, column)
// });

var hasUndefined = true;
function fillCells(rowPos, rowMax, colPos, colMax) {
    while (rowPos < rowMax) {
        var colMaxIt = colMax;
        var colPosIt = colPos;
        while (colPosIt < colMaxIt) {
            // if (rows[rowPos][colPosIt].innerText == '') {
              placeValue(rows[rowPos][colPosIt], rowPos, colPosIt);
            // }
            colPosIt++;
        }
        rowPos++;
    }
}

// while(hasUndefined) {
//   hasUndefined = false;
  fillCells(0,9,0,9);
// }

