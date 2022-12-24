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
let ai = "easy"
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

//handles the entirety of our win checking
function checkWin(grid, currentCoordinate) {
    //use current cooridnates to build y and x
    let y = currentCoordinate[1]
    let x = currentCoordinate[0]
    //dummyGrid for recursive uses
    dummyGrid = [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
    ]

    //determine whether or not to run a check on column wins
    if ((y+1 < 6) && grid[y][x] === grid[y+1][x]){
        range = 0
        checkColumn(grid,x, y)
    }

    //scuffed row check. I'm suprised it works but am not willing to touch it.
    if ((x+1 < 7) && grid[y][x] === grid[y][x+1]){
        range = 0
        checkRow(grid,x, y)
    }

    if ((x-1 >= 0) && grid[y][x] === grid[y][x-1]){
        range = 0
        checkRow(grid,x,y)
    }

    //determine whether or not to run a check on diag wins
    if ((y+1 < 6 && x+1 < 7) && grid[y][x] === grid[y+1][x+1]){
        range = 0
        checkDiagBLTR(grid, x, y)
    }
    //determine whether or not to run a check on diag wins
    if ((y-1 >= 0 && x+1 < 7) && grid[y][x] === grid[y-1][x+1]){
        range = 0
        checkDiagTLBR(grid, x, y)
    }
    //determine whether or not to run a check on diag wins
    if ((y-1 >= 0 && x-1 >= 0) && grid[y][x] === grid[y-1][x-1]){
        range = 0
        checkDiagBLTR(grid, x, y)
    }
    //determine whether or not to run a check on diag wins
    if ((y+1 < 6 && x-1 >= 0) && grid[y][x] === grid[y+1][x-1]){
        range = 0
        checkDiagTLBR(grid, x, y)
    }
}

//check column - simple recursive check straight down
function checkColumn(grid,x, y){
    let oldRange = 0

    if ((y+1 < 6) && grid[y][x] === grid[y+1][x]){
        oldRange = range
        range++
        checkColumn(grid, x, y+1)
    }

    if (range >= 3){
        winflag = true
    }

    if (oldRange === range){
        return
    }
}

//check row - recursive check both to the right and left of the row. dummyGrid is used to prevent backflow
function checkRow(grid,x, y){
    let oldRange = 0

    if ((x+1 < 7) && grid[y][x] === grid[y][x+1] && dummyGrid[y][x+1] !== 1){
        dummyGrid[y][x] = 1
        oldRange = range
        range++
        checkRow(grid, x+1, y)
    } 

    if ((x-1 >= 0) && grid[y][x] === grid[y][x-1] && dummyGrid[y][x-1] !== 1){
        dummyGrid[y][x] = 1
        oldRange = range
        range++
        checkRow(grid, x-1, y)
    }

    if (range >= 3){
        winflag = true
    }

    if (oldRange === range){
        return
    }
}

//diag check, similar logic to the row but for bottom left -> top right diags
function checkDiagBLTR(grid,x, y){
    let oldRange = 0
    if ((y+1 < 6 && x+1 < 7) && grid[y][x] === grid[y+1][x+1] && dummyGrid[y+1][x+1] !== 1){
        dummyGrid[y][x] = 1
        oldRange = range
        range++
        checkDiagBLTR(grid, x+1, y+1)
    }
    if ((y-1 >= 0 && x-1 >= 0) && grid[y][x] === grid[y-1][x-1] && dummyGrid[y-1][x-1] !== 1){
        dummyGrid[y][x] = 1
        oldRange = range
        range++
        checkDiagBLTR(grid, x-1, y-1)
    }

    if (range >= 3){
        winflag = true
    } 

    if (oldRange === range){
        return
    }
}

//diag check, similar logic to the row but for top left -> bottom right diags
function checkDiagTLBR(grid, x, y){
    let oldRange = 0
    if ((y+1 < 6 && x-1 >= 0) && grid[y][x] === grid[y+1][x-1] && dummyGrid[y+1][x-1] !== 1){
        dummyGrid[y][x] = 1
        oldRange = range
        range++
        checkDiagTLBR(grid, x-1, y+1)
    }
    if ((y-1 >= 0 && x+1 < 7) && grid[y][x] === grid[y-1][x+1] && dummyGrid[y-1][x+1] !== 1){
        dummyGrid[y][x] = 1
        oldRange = range
        range++
        checkDiagTLBR(grid, x+1, y-1)
    }
    if (range >= 3){
        winflag = true
    }

    if (oldRange === range){
        return
    }

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