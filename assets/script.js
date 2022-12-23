const game = document.querySelector("#game")
const endgame = document.querySelector("#endgame")
const winner = document.querySelector("#winner")
const tryBtn = document.querySelector("#tryagain")
const drops = document.querySelectorAll(".drop")
const cells = document.querySelectorAll(".cell")
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


function handleTurn(e){
    let currentcolumn = e.target.getAttribute("data-column")
    let currentdepth;
    let column = currentcolumn.charCodeAt(0)-97
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
    let currentcell = currentcolumn+currentdepth

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

    checkWin(grid, currentCoordinate)

    if (winflag === true){
        gameOver()
    }

    playerTurn = playerTurn === 1 ? -1 : 1
    playerActive = playerActive === "Red" ? "Yellow" : "Red"
}

drops.forEach(drop =>{
    drop.addEventListener("click", handleTurn)
})

function checkWin(grid, currentCoordinate) {
    let y = currentCoordinate[1]
    let x = currentCoordinate[0]
    dummyGrid = [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
    ]

    if ((y+1 < 6) && grid[y][x] === grid[y+1][x]){
        range = 0
        checkColumn(grid,x, y)
    }

    //redo logic later --- needs to be x+1<7 or the like. not breaking right now for some reason that i dont understand
    if ((grid[y][x+1] !== undefined || grid[y][x-1] !== undefined) && (grid[y][x] === grid[y][x+1]) || (grid[y][x] === grid[y][x-1]) ){
        range = 0
        checkRow(grid,x, y)
    }

    if ((y+1 < 6 && x+1 < 7) && grid[y][x] === grid[y+1][x+1]){
        range = 0
        checkDiagBLTR(grid, x, y)
    }

    if ((y-1 >= 0 && x+1 < 7) && grid[y][x] === grid[y-1][x+1]){
        range = 0
        checkDiagTLBR(grid, x, y)
    }

    if ((y-1 >= 0 && x-1 >= 0) && grid[y][x] === grid[y-1][x-1]){
        range = 0
        checkDiagBLTR(grid, x, y)
    }

    if ((y+1 < 6 && x-1 >= 0) && grid[y][x] === grid[y+1][x-1]){
        range = 0
        checkDiagTLBR(grid, x, y)
    }
}

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

function gameOver(){
    console.log("game over!")
    game.classList.add("hide")
    endgame.classList.remove("hide")
    winner.innerText = `${playerActive} wins!!!`
    if (playerActive === "Red"){
        winner.classList.add("red")
    } else winner.classList.add("yellow")
    tryBtn.addEventListener("click", resetGame)
}

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

cells.forEach(cell => {
    cell.innerText = ""
    cell.classList.remove("yellow")
    cell.classList.remove("red")
})
game.classList.remove("hide")
endgame.classList.add("hide")
winner.classList.remove("yellow")
winner.classList.remove("red")
}

//TODO:
//GAMEOVER FUNCTION
//GET RID OF BUTTONS WHEN DEPTH IS 0
//RUDIMENTARY RANDOM AI OPPONENT
