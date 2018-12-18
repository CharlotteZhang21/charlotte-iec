//duration of ad in seconds
var time_ad = 50;

// number of points for game over
var max_points = 300;

//figures on start

//INSTRUCTIONS
//1.Choose figure to add on field (some figures have 2 directions - "hor" (horizontal) and "ver" (vertical)).
//2.Set value "onField" as "true" (other keep as "false")
//3. Set cell, from which figure will start. All figures start from top left corner. Count cell from 0 to 9 (inrows and in columns).
// For example, if you want to add figure "blue" (like "L"), you can set value for "row" as "5" and for "column" as "3".
//Please, pay attention, that should be placed on the field. Otherwise it will be ignored.

var figures = [
    //3x3 (even in horizon or vertical)
    {figure: '3x3', onField: false, row: 0, column: 0},
    //2x2 (even in horizon or vertical)
    {figure: '2x2', onField: false, row: 0, column: 0},

    //3 + 2 (like "L")
    {figure: '3+2', direction: 'hor', onField: false, row: 0, column: 0},
    {figure: '3+2', direction: 'ver', onField: false, row: 0, column: 0},
    //2x1
    {figure: '2x1', direction: 'hor', onField: false, row: 0, column: 0},
    {figure: '2x1', direction: 'ver', onField: false, row: 0, column: 0},
    //5 (in row or column)
    {figure: '5', direction: 'hor', onField: false, row: 0, column: 0},
    {figure: '5', direction: 'ver', onField: false, row: 0, column: 0},
    //4 (in row or column)
    {figure: '4', direction: 'hor', onField: false, row: 0, column: 0},
    {figure: '4', direction: 'ver', onField: false, row: 0, column: 0},
    //3 (in row or column)
    {figure: '3', direction: 'ver', onField: false, row: 0, column: 0},
    {figure: '3', direction: 'hor', onField: false, row: 0, column: 0},
    //2 (in row or column)
    {figure: '2', direction: 'hor', onField: false, row: 0, column: 0},
    {figure: '2', direction: 'ver', onField: false, row: 0, column: 0},
    //1 (single)
    {figure: '1', onField: false, row: 8, column: 9}

]

//combos near field
//3x3 - 2
//2x2 - 3
//3 + 2 - 1
//2x1 - 4
//5 - 8
//4 - 6
//3 - 5
//2 - 9
//1 - 7
var combos = [2, 5, 4];
//directions of combos. Horizontal - 1, vertical - 0;
var directions = [0, 0, 0]