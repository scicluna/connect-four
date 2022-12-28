//declare DOMS
const game = document.querySelector("#game")
const endgame = document.querySelector("#endgame")
const winner = document.querySelector("#winner")
const tryBtn = document.querySelector("#tryagain")
const drops = document.querySelectorAll(".drop")
const dropa = document.querySelector("#adrop")
const dropb = document.querySelector("#bdrop")
const dropc = document.querySelector("#cdrop")
const dropd = document.querySelector("#ddrop")
const drope = document.querySelector("#edrop")
const dropf = document.querySelector("#fdrop")
const dropg = document.querySelector("#gdrop")
const cells = document.querySelectorAll(".cell")

//init important variables
let ai = "medium"
let aDepth = 6
let bDepth = 6
let cDepth = 6
let dDepth = 6
let eDepth = 6
let fDepth = 6
let gDepth = 6
let playerTurn = 1
let playerActive = "Red"
let grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
]
let dummyGrid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
]
let evoGrid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
]
let range = 0
let winflag = false
let tieflag = false

//handles the user-click
function handleTurn(e){
    //using the data-column attribute of the HTML to get a value for current column
    let currentcolumn = e.target.getAttribute("data-column")
    let currentdepth; //init currentdepth
    let column = currentcolumn.charCodeAt(0)-97 //charCodeAt(0)-97 turns a-g into integers

    //determining the current depth
    switch (currentcolumn){
        case "a": currentdepth = aDepth
        break;
        case "b": currentdepth = bDepth
        break;
        case "c": currentdepth = cDepth
        break;
        case "d": currentdepth = dDepth
        break;
        case "e": currentdepth = eDepth
        break;
        case "f": currentdepth = fDepth
        break;
        case "g": currentdepth = gDepth
        break;
    }
    //creating coordinates to compare with data-spot
    let currentcell = currentcolumn+currentdepth

    //placing the "O"s on the grid
    if (currentdepth >= 0){
    cells.forEach(cell =>{
        if (currentcell === cell.getAttribute("data-spot")){
            cell.innerText = "O"
            grid[currentdepth-1][column] = playerTurn
            if(playerTurn === 1){
                cell.classList.add("red")
            } else cell.classList.add("yellow")
        }
    })

    //iterating the depth based on the current cell
    switch (true){
        case currentcell.startsWith("a"): aDepth--
        break;
        case currentcell.startsWith("b"): bDepth--
        break;
        case currentcell.startsWith("c"): cDepth--
        break;
        case currentcell.startsWith("d"): dDepth--
        break;
        case currentcell.startsWith("e"): eDepth--
        break;
        case currentcell.startsWith("f"): fDepth--
        break;
        case currentcell.startsWith("g"): gDepth--
        break;
    }
    }

    //currentCoordinates is established for use with our checkWin function
    let currentCoordinate = currentcell.split("")
    switch (currentCoordinate[0]){
        case "a": currentCoordinate[0] = 0
        break;
        case "b": currentCoordinate[0] = 1
        break;
        case "c": currentCoordinate[0] = 2
        break;
        case "d": currentCoordinate[0] = 3
        break;
        case "e": currentCoordinate[0] = 4
        break;
        case "f": currentCoordinate[0] = 5
        break;
        case "g": currentCoordinate[0] = 6
        break;
    }
    currentCoordinate[1] -= 1

    //call our checkWin/checkCall functions
    checkWin(grid, currentCoordinate)
    checkTie(grid)

    //if winflag is on, the game ends
    if (winflag === true){
        gameOver()
    }

    //clean up our drop eventlisteners in the case that a column fills up
    cleanDrops(e)
    
    //change the active player
    playerTurn = playerTurn === 1 ? -1 : 1
    playerActive = playerActive === "Red" ? "Yellow" : "Red"

        if(ai === "easy" && winflag === false){
            easyAi(grid)
        }

        if(ai === "medium" && winflag === false){
            mediumAi(grid)
        }

}

//build out the initial eventlisteners
drops.forEach(drop =>{
    drop.addEventListener("click", handleTurn)
})

//removing event listeners if the depth of the column is 0
function cleanDrops(e){
    if (( e === 'a' || e.srcElement.dataset.column === 'a') && aDepth === 0){
        dropa.removeEventListener("click", handleTurn)
    }
    if ((e === 'b' || e.srcElement.dataset.column === 'b')&& bDepth === 0){
        dropb.removeEventListener("click", handleTurn)
    }
    if ((e === 'c' || e.srcElement.dataset.column === 'c') && cDepth === 0){
        dropc.removeEventListener("click", handleTurn)
    }
    if ((e === 'd' || e.srcElement.dataset.column === 'd') && dDepth === 0){
        dropd.removeEventListener("click", handleTurn)
    }
    if ((e === 'e' || e.srcElement.dataset.column === 'e') && eDepth === 0){
        drope.removeEventListener("click", handleTurn)
    }
    if ((e === 'f' || e.srcElement.dataset.column === 'f') && fDepth === 0){
        dropf.removeEventListener("click", handleTurn)
    }
    if ((e === 'g' || e.srcElement.dataset.column === 'g') && gDepth === 0){
        dropg.removeEventListener("click", handleTurn)
    }
}


function isInBounds(y,x,grid){
    if (x <= grid[0].length-1 && x >= 0 && y <= grid.length-1 && y >= 0){
        return true
    } return false
}

function checkNext (grid, y, x, moveDirection){

    let {newY, newX} = moveDirection(y,x)

    if(range !== 4 && isInBounds(newY, newX, grid) && dummyGrid[newY][newX] !== 1 && grid[y][x] === grid[newY][newX]){
        range++
        checkNext(grid, newY, newX, moveDirection)
        return
    }

    if (range >= 3){
        winflag = true
    }
}

//now working
const moveDown = function moveDown(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y+1,newX: x}
    return newCoords
}

const moveRight = function moveRight(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y,newX: x+1}
    return newCoords
}

const moveLeft = function moveLeft(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y,newX: x-1}
    return newCoords
}

const moveDownandRight = function moveDownandRight(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y-1,newX: x+1}
    return newCoords
}

const moveUpandRight = function moveUpandRight(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y+1,newX: x+1}
    return newCoords
}

const moveDownandLeft = function moveDownandLeft(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y-1,newX: x-1}
    return newCoords
}

const moveUpandLeft = function moveUpandLeft(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y+1,newX: x-1 }
    return newCoords
}

//handles the entirety of our win checking
//make temp copy of grid -- place down a coordiante and test that for wins -- or return highest range
function checkWin(grid, currentCoordinate) {
    //use current cooridnates to build y and x
    let y = currentCoordinate[1]
    let x = currentCoordinate[0]

    range = 0
    //dummyGrid for recursive uses
    dummyGrid = [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
    ]

    checkNext(grid, y, x, moveDown)
    range = 0  
    checkNext(grid, y, x, moveRight)
    checkNext(grid, y, x, moveLeft)
    range = 0  
    checkNext(grid, y, x, moveDownandLeft)
    checkNext(grid, y, x, moveUpandRight)
    range = 0                                //diagonals are segmented with range 0 to prevent zig-zags
    checkNext(grid, y, x, moveDownandRight)     
    checkNext(grid, y, x, moveUpandLeft)
    
}

//check for ties/full board
function checkTie(grid){
    if (!grid.flat().includes(0)){
        tieflag = true
        gameOver()
    } 
}

//handling gameovers
function gameOver(){
    console.log("game over!")
    game.classList.add("fade")
    endgame.classList.remove("hide")
    if(!tieflag){
    winner.innerText = `${playerActive} wins!!!`
    if (playerActive === "Red"){
        winner.classList.add("red")
    } else winner.classList.add("yellow")
    } else winner.innerText = "Tie Game"

    tryBtn.addEventListener("click", resetGame)
}

//reseting everything to a default state
function resetGame(){
aDepth = 6
bDepth = 6
cDepth = 6
dDepth = 6
eDepth = 6
fDepth = 6
gDepth = 6
playerTurn = 1
playerActive = "Red"
grid = [
[0,0,0,0,0,0,0],
[0,0,0,0,0,0,0],
[0,0,0,0,0,0,0],
[0,0,0,0,0,0,0],
[0,0,0,0,0,0,0],
[0,0,0,0,0,0,0],
]
range = 0
winflag = false
tieflag = false

cells.forEach(cell => {
    cell.innerText = ""
    cell.classList.remove("yellow")
    cell.classList.remove("red")
})
game.classList.remove("fade")
endgame.classList.add("hide")
winner.classList.remove("yellow")
winner.classList.remove("red")

drops.forEach(drop =>{
    drop.removeEventListener("click", handleTurn)
})

drops.forEach(drop =>{
    drop.addEventListener("click", handleTurn)
})
}

//TODO:
//RUDIMENTARY RANDOM AI OPPONENT

function easyAi(grid){
    //pick random column
    let aiColumn = []
    if(aDepth !== 0){aiColumn.push("a")}
    if(bDepth !== 0){aiColumn.push("b")}
    if(cDepth !== 0){aiColumn.push("c")}
    if(dDepth !== 0){aiColumn.push("d")}
    if(eDepth !== 0){aiColumn.push("e")}
    if(fDepth !== 0){aiColumn.push("f")}
    if(gDepth !== 0){aiColumn.push("g")}
    let rand = Math.floor(Math.random()*aiColumn.length)
    let aiPick = aiColumn[rand]
    //determine its depth
    let aiDepth;
    switch (aiPick){
        case "a": aiDepth = aDepth
        break;
        case "b": aiDepth = bDepth
        break;
        case "c": aiDepth = cDepth
        break;
        case "d": aiDepth = dDepth
        break;
        case "e": aiDepth = eDepth
        break;
        case "f": aiDepth = fDepth
        break;
        case "g": aiDepth = gDepth
        break;
    }
    //place an "O" in that cell with correct styling
    let aiCol = aiPick.charCodeAt(0)-97
    let aiCell = aiPick+aiDepth



    //placing the "O"s on the grid
    if (aiDepth >= 0){
    cells.forEach(cell =>{
        if (aiCell === cell.getAttribute("data-spot")){
            cell.innerText = "O"
            grid[aiDepth-1][aiCol] = playerTurn
            if(playerTurn === 1){
                cell.classList.add("red")
            } else cell.classList.add("yellow")
        }
    })
    }

    switch (true){
        case aiCell.startsWith("a"): aDepth--
        break;
        case aiCell.startsWith("b"): bDepth--
        break;
        case aiCell.startsWith("c"): cDepth--
        break;
        case aiCell.startsWith("d"): dDepth--
        break;
        case aiCell.startsWith("e"): eDepth--
        break;
        case aiCell.startsWith("f"): fDepth--
        break;
        case aiCell.startsWith("g"): gDepth--
        break;
    }

    let aiCoordinate = aiCell.split("")
    switch (aiCoordinate[0]){
        case "a": aiCoordinate[0] = 0
        break;
        case "b": aiCoordinate[0] = 1
        break;
        case "c": aiCoordinate[0] = 2
        break;
        case "d": aiCoordinate[0] = 3
        break;
        case "e": aiCoordinate[0] = 4
        break;
        case "f": aiCoordinate[0] = 5
        break;
        case "g": aiCoordinate[0] = 6
        break;
    }
    aiCoordinate[1] -= 1


    checkWin(grid, aiCoordinate)
    checkTie(grid)

    if (winflag === true){
        gameOver()
    }

    //clean up our drop eventlisteners in the case that a column fills up
    
    //change the active player
    playerTurn = playerTurn === 1 ? -1 : 1
    playerActive = playerActive === "Red" ? "Yellow" : "Red"
}

function mediumAi(grid){
    evaluateGrid(grid)
    let aiColumn = []
    if(aDepth !== 0 && (evoGrid[aDepth-1][0] === Math.max(...evoGrid.flat()))){aiColumn.push("a")}
    if(bDepth !== 0 && (evoGrid[bDepth-1][1] === Math.max(...evoGrid.flat()))){aiColumn.push("b")}
    if(cDepth !== 0 && (evoGrid[cDepth-1][2] === Math.max(...evoGrid.flat()))){aiColumn.push("c")}
    if(dDepth !== 0 && (evoGrid[dDepth-1][3] === Math.max(...evoGrid.flat()))){aiColumn.push("d")}
    if(eDepth !== 0 && (evoGrid[eDepth-1][4]=== Math.max(...evoGrid.flat()))){aiColumn.push("e")}
    if(fDepth !== 0 && (evoGrid[fDepth-1][5] === Math.max(...evoGrid.flat()))){aiColumn.push("f")}
    if(gDepth !== 0 && (evoGrid[gDepth-1][6] === Math.max(...evoGrid.flat()))){aiColumn.push("g")}
    let rand = Math.floor(Math.random()*aiColumn.length)
    let aiPick = aiColumn[rand]
    let aiDepth;
    switch (aiPick){
        case "a": aiDepth = aDepth
        break;
        case "b": aiDepth = bDepth
        break;
        case "c": aiDepth = cDepth
        break;
        case "d": aiDepth = dDepth
        break;
        case "e": aiDepth = eDepth
        break;
        case "f": aiDepth = fDepth
        break;
        case "g": aiDepth = gDepth
        break;
    }
    //place an "O" in that cell with correct styling
    let aiCol = aiPick.charCodeAt(0)-97
    let aiCell = aiPick+aiDepth



    //placing the "O"s on the grid
    if (aiDepth >= 0){
    cells.forEach(cell =>{
        if (aiCell === cell.getAttribute("data-spot")){
            cell.innerText = "O"
            grid[aiDepth-1][aiCol] = playerTurn
            if(playerTurn === 1){
                cell.classList.add("red")
            } else cell.classList.add("yellow")
        }
    })
    }

    switch (true){
        case aiCell.startsWith("a"): aDepth--
        break;
        case aiCell.startsWith("b"): bDepth--
        break;
        case aiCell.startsWith("c"): cDepth--
        break;
        case aiCell.startsWith("d"): dDepth--
        break;
        case aiCell.startsWith("e"): eDepth--
        break;
        case aiCell.startsWith("f"): fDepth--
        break;
        case aiCell.startsWith("g"): gDepth--
        break;
    }

    let aiCoordinate = aiCell.split("")
    switch (aiCoordinate[0]){
        case "a": aiCoordinate[0] = 0
        break;
        case "b": aiCoordinate[0] = 1
        break;
        case "c": aiCoordinate[0] = 2
        break;
        case "d": aiCoordinate[0] = 3
        break;
        case "e": aiCoordinate[0] = 4
        break;
        case "f": aiCoordinate[0] = 5
        break;
        case "g": aiCoordinate[0] = 6
        break;
    }
    aiCoordinate[1] -= 1


    checkWin(grid, aiCoordinate)
    checkTie(grid)

    if (winflag === true){
        gameOver()
    }

    //clean up our drop eventlisteners in the case that a column fills up
    
    //change the active player
    playerTurn = playerTurn === 1 ? -1 : 1
    playerActive = playerActive === "Red" ? "Yellow" : "Red"
}

function evaluateGrid(grid){
    evoGrid = [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
    ]
    dummyGrid = [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
    ]
for (let i=grid.length-1; i>=0; i--){
    for (let j=0; j<grid[0].length; j++){
        let cell = `${j}${i}`
        let y = parseInt(cell[1])
        let x = parseInt(cell[0])
        evaluateRange(grid, y, x, evoDown, y, x)
        evaluateRange(grid, y, x, evoUp, y, x)
        range = 0
        evaluateRange(grid, y, x, evoRight, y, x)
        evaluateRange(grid, y, x, evoLeft, y, x)
        range = 0
        evaluateRange(grid, y, x, evoDownandLeft, y, x)
        evaluateRange(grid, y, x, evoUpandRight, y, x)        
        range = 0
        evaluateRange(grid, y, x, evoDownandRight, y, x)     
        evaluateRange(grid, y, x, evoUpandLeft, y, x)
        range = 0
    }
}



}

function evaluateRange(grid, y, x, moveDirection, ogY, ogX){


    let {newY, newX} = moveDirection(y,x)
    let currentCol = x
    let currentDepth;
    switch (currentCol){
        case 0: currentDepth = aDepth
        break;
        case 1: currentDepth = bDepth
        break;
        case 2: currentDepth = cDepth
        break;
        case 3: currentDepth = dDepth
        break;
        case 4: currentDepth = eDepth
        break;
        case 5: currentDepth = fDepth
        break;
        case 6: currentDepth = gDepth
        break;
    }
    
    if(isInBounds(newY, newX, grid) && grid[newY][newX] !== 0 && grid[y][x] === 0 && ogY === currentDepth-1 && grid[y][x] !== grid[newY][newX]){
        range++
        if(evoGrid[ogY][ogX] < range){
            evoGrid[ogY][ogX] = range
            }
        evaluateRange(grid, newY, newX, moveDirection, ogY, ogX)

    }

    if(isInBounds(newY, newX, grid ) && grid[y][x] !== 0 && grid[y][x] === grid[newY][newX] && grid[ogY][ogX] === 0){
        range++
        if(evoGrid[ogY][ogX] < range){
        evoGrid[ogY][ogX] = range
        }
        evaluateRange(grid, newY, newX, moveDirection, ogY, ogX)
    }


}

const evoUp = function evoUp(y,x){
    dummyGrid[y][x] = 1
    let newCoords = {newY: y-1,newX: x}
    return newCoords
}


const evoDown = function evoDown(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y+1,newX: x}
    return newCoords
}

const evoRight = function evoRight(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y,newX: x+1}
    return newCoords
}

const evoLeft = function evoLeft(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y,newX: x-1}
    return newCoords
}

const evoDownandRight = function evoDownandRight(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y-1,newX: x+1}
    return newCoords
}

const evoUpandRight = function evoUpandRight(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y+1,newX: x+1}
    return newCoords
}

const evoDownandLeft = function evoDownandLeft(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y-1,newX: x-1}
    return newCoords
}

const evoUpandLeft = function evoUpandLeft(y,x) {
    dummyGrid[y][x] = 1
    let newCoords = {newY: y+1,newX: x-1 }
    return newCoords
}