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
let grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
]
    

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
    console.log(currentcell)

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
    checkWin()




    console.log(grid)
    playerTurn = playerTurn === 1 ? -1 : 1
}

drops.forEach(drop =>{
    drop.addEventListener("click", handleTurn)
})

function checkWin() {

}