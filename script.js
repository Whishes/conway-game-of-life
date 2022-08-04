// Globals
const gridX = 50;
const gridY = 30;
let gameGrid = [];
let futureGrid = [];
let previousGrid = [];
let count = 0;
let isRunning = false;
let isMouseDown = false;
const genNum = document.getElementById("generation_num");

const getRandomColorHex = () => {
	const pastelColors = [
		"#FF9AA2",
		"#FFB7B2",
		"#FFDAC1",
		"#E2D0CB",
		"#C7CEEA",
		"#C1E7E3",
		"#DCFFFB",
		"#FFDCF4",
		"#DABFDE",
		"#C1BBDD",
		"#F8DF81",
		"#D9639D",
		"#F278AB",
	];

	return pastelColors[Math.floor(Math.random() * pastelColors.length - 1)];
};

// check gameGrid values if "live" cells exist
const checkGrid = (grid) => {
	for (i = 0; i < grid.length; i++) {
		for (j = 0; j < grid[i].length; j++) {
			if (grid[i][j] === 1) {
				return true;
			}
		}
	}
	return false;
};

// game logic
const getNextGeneration = (grid) => {
	//console.log(grid);
	const gridCollection = document.getElementsByClassName("row");
	let gridContainer = [...gridCollection];

	// generate new array to be returned
	let nextGeneration = new Array(gridY);
	for (let i = 0; i < gridY; i++) {
		nextGeneration[i] = new Array(gridX).fill(0);
	}

	// 1. Any live cell with fewer than two live neighbors dies as if caused by underpopulation.
	// 2. Any live cell with two or three live neighbors lives on to the next generation.
	// 3. Any live cell with more than three live neighbors dies, as if by overpopulation.
	// 4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

	// loop through each individual cell and check for the above rules
	for (let i = 0; i < gridY; i++) {
		for (let j = 0; j < gridX; j++) {
			// get the cell's amount of neighbours

			// [-1 , 0, 1]
			// [-1, *, 1] for checking the x values
			// [-1, 0, 1] * is the target/specific cell

			// [-1, -1, -1]
			// [0, *, 0] for checking y values
			// [1, 1, 1] * is the target/specific cell
			let numNeighbours = 0;
			for (let k = -1; k < 2; k++) {
				for (let l = -1; l < 2; l++) {
					// prettier-ignore
					if ((i + k >= 0 && i + k < gridY) && (j + l >= 0 && j + l < gridX)) {
						numNeighbours += grid[i + k][j + l];
					}
				}
			}

			// minus value to count for it checking itself
			numNeighbours = numNeighbours - grid[i][j];

			// implementing the rules (check if the cells dies first)

			// rule 1
			if (grid[i][j] == 1 && numNeighbours < 2) {
				nextGeneration[i][j] = 0;
				gridContainer[i].children[j].style.backgroundColor =
					getRandomColorHex();
			} else if (grid[i][j] == 1 && numNeighbours > 3) {
				// rule 3
				nextGeneration[i][j] = 0;
				gridContainer[i].children[j].style.backgroundColor =
					getRandomColorHex();
			} else if (grid[i][j] == 0 && numNeighbours == 3) {
				// rule 4
				nextGeneration[i][j] = 1;
				gridContainer[i].children[j].style.backgroundColor = "#ADF7B6";
			} else {
				// rule 2
				nextGeneration[i][j] = grid[i][j];
				if (grid[i][j] === 1) {
					gridContainer[i].children[j].style.backgroundColor = "#C2D5A8";
				}
			}
		}
	}

	return nextGeneration;
};

// reset/clear game/grid state
const clearGrid = () => {
	const gridCollection = document.getElementsByClassName("row");
	let gridContainer = [...gridCollection];

	gamePause();

	setTimeout(() => {
		for (let i = 0; i < gridY; i++) {
			for (let j = 0; j < gridX; j++) {
				gameGrid[i][j] = 0;
				gridContainer[i].children[j].style.backgroundColor = "white";
			}
		}
		futureGrid.length = 0;
		previousGrid.length = 0;
		count = 0;
		genNum.textContent = count;
		//console.log("grid cleared");
	}, 1000);
};

// pause game on button click
const gamePause = () => {
	isRunning = false;
};

// main game loop
const gameRecursion = () => {
	if (isRunning) {
		//futureGrid = getNextGeneration(gameGrid);
		//console.log(futureGrid);
		setTimeout(() => {
			count = count + 1;
			//console.log("Generation: ", count);
			genNum.textContent = count;

			if (futureGrid.length > 0) {
				previousGrid = futureGrid;
				futureGrid = getNextGeneration(futureGrid);
			} else {
				futureGrid = getNextGeneration(gameGrid);
			}

			if (JSON.stringify(futureGrid) === JSON.stringify(previousGrid)) {
				gamePause();
				window.alert(`Game ended at generation: ${count}`);
			} else {
				gameRecursion();
			}
		}, 1000);
	} else {
		console.log("Game has been paused/not running");
	}
};

// start game on button click
const gameStart = () => {
	isRunning = true;
	// check if any cells have been pressed
	if (checkGrid(gameGrid)) {
		gameRecursion();
	} else {
		window.alert("No cells have been clicked to start the game");
	}
};

// change colour/value of cell on mouse click
const cellOnClick = (event) => {
	event.preventDefault();
	//console.log(event);
	if (event.type === "mousedown") {
		isMouseDown = true;

		cellX = event.target.className.split(" ")[1];
		cellY = event.target.parentNode.className.split(" ")[1];
		//console.log("X: ", cellX);
		//console.log("Y: ", cellY);

		// if cell hasn't been clicked then do this
		if (gameGrid[cellY][cellX] === 0) {
			// change specific values in gameGrid arr to int 1
			gameGrid[cellY][cellX] = 1;

			event.target.style.backgroundColor = "#C2D5A8";
		} else {
			// if cell has already been clicked on then do this
			gameGrid[cellY][cellX] = 0;
			event.target.style.backgroundColor = null;
		}
	}
	if (event.type === "mouseover" && isMouseDown) {
		// get position of clicked cell in gameGrid
		cellX = event.target.className.split(" ")[1];
		cellY = event.target.parentNode.className.split(" ")[1];
		//console.log("X: ", cellX);
		//console.log("Y: ", cellY);

		// if cell hasn't been clicked then do this
		if (gameGrid[cellY][cellX] === 0) {
			// change specific values in gameGrid arr to int 1
			gameGrid[cellY][cellX] = 1;

			event.target.style.backgroundColor = "#C2D5A8";
		} else {
			// if cell has already been clicked on then do this
			gameGrid[cellY][cellX] = 0;
			event.target.style.backgroundColor = null;
		}
		//console.log(gameGrid);
	}
};

// load game field
window.onload = () => {
	const gridContainer = document.getElementById("gameContainer");
	gridContainer.addEventListener("mouseup", () => {
		isMouseDown = false;
	});

	for (i = 0; i < gridY; i++) {
		const gridRow = document.createElement("div");
		gridRow.className = `row ${i}`;
		gameGrid[i] = [];
		for (j = 0; j < gridX; j++) {
			const gridCell = document.createElement("div");
			gridCell.className = `cell ${j}`;
			gridCell.addEventListener("mousedown", () => cellOnClick(event));
			gridCell.addEventListener("mouseover", () => cellOnClick(event));
			gridRow.appendChild(gridCell);
			gameGrid[i][j] = 0;
		}
		gridContainer.appendChild(gridRow);
	}
	document.body.appendChild(gridContainer);
};

//console.log(gameGrid);
