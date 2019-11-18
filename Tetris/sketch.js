// This is the size in pixels of a single square
let gridSize = 30;

// List of all the possible shapes of pieces
let letters = ['T', 'leftL', 'rightL', 'leftS', 'rightS', 'Q', 'I'];

// List of the names of the panels in the board
let names = ['new', 'score', 'message'];

let master;
let board;
let arena;

function setup() {
	createCanvas(500, 800);

	master = new Master();
	board = new Board();
	arena = new Arena();
	arena.createGrid();
	arena.createPiece();
}

function draw() {
	background(0);

	master.update();
	master.display();
}

function keyPressed() {
	if (!master.paused && !master.lost) {
		if (keyCode === RIGHT_ARROW) {
			arena.piece.move('right');
		}
		else if (keyCode === LEFT_ARROW) {
			arena.piece.move('left');
		}
		else if (keyCode === DOWN_ARROW) {
			master.downKeyPressed = true;
		}
		else if (keyCode === UP_ARROW) {
			arena.piece.rotate();
		}
		else if (key === ' ') {
			// Then pause the game
			master.paused = true;
			board.changeMessage('Press SPACEBAR to continue');
		}
	}
	else {
		if (key === ' ' && !master.lost) {
			master.paused = false;
			board.changeMessage('Press SPACEBAR to pause');
		}
	}
}

function keyReleased() {
	if (keyCode === DOWN_ARROW) {
		master.downKeyPressed = false;
		master.start = new Date();
	}
}

function mousePressed() {
	board.checkClicked(mouseX, mouseY);
}

class Master {
	// This class controls the game
	constructor() {
		this.lost = false;
		this.score = 0;
		this.paused = true;

		// Variables that set the framerate
		this.start = new Date();
		this.waitFor = 400;

		this.downKeyPressed = false;
	}

	update() {
		if (!this.paused) {
			if (this.downKeyPressed) {
				arena.piece.move('down');
			}

			// Updates the elements
			if (!this.lost) {
				if (this.waitedEnough()) {
					arena.update();
				}
			}
		}
	}

	display() {
		// Calls display on all the elements
		board.display();
		arena.display();
	}

	waitedEnough() {
		// Checks if the waiting time is enough
		let now = new Date();
		if (now - this.start > this.waitFor) {
			this.start = new Date();
			return true;
		}
		return false;
	}

	endGame() {
		// Display message and stop updating
		this.lost = true;
		this.paused = true;
		board.changeMessage('Player has lost');
	}

	newGame() {
		// New piece, new grid, and reset master variables
		arena.createGrid();
		arena.createPiece();
		master.reset();
		board.update();
		board.changeMessage('Press SPACEBAR to start');
	}

	reset() {
		// Master resets its variables to the default
		this.score = 0;
		this.paused = true;
		this.lost = false;
	}
}

class Board {
	// This class displays messages and score
	constructor() {
		// Create the panels of the board following the names array
		this.panels = [];
		for (let i = 0, n = names.length; i < n; i++) {
			let newPanel = new Panel(names[i]);
			this.panels.push(newPanel);
		}
	}

	update() {
		// Update the text in the score panel
		this.panels[1].text = 'Score: ' + master.score;
	}

	display() {
		for (let i = 0, n = this.panels.length; i < n; i++) {
			this.panels[i].display();
		}
	}

	checkClicked(mx, my) {
		// Calls the panel which accepts a user's click, which is only the 'new' panel
		if (this.panels[0].isClicked(mx, my)) {
			this.panels[0].whenClicked();
		}
	}

	changeMessage(string) {
		// Receives a string and updates the message on the board
		this.panels[2].text = string;
	}
}

class Panel {
	constructor(label) {
		this.label = label;
		if (this.label == 'new') {
			this.x = 0;
			this.y = 0;
			this.xsize = width / 2;
			this.ysize = 50;
			this.text = 'New game';
		}
		else if (this.label == 'score') {
			this.x = width / 2;
			this.y = 0;
			this.xsize = width / 2;
			this.ysize = 50;
			this.text = 'Score: ' + master.score;
		}
		else if (this.label = 'message') {
			this.x = 0;
			this.y = 50;
			this.xsize = width;
			this.ysize = 50;
			this.text = 'Press SPACEBAR to start';
		}
	}

	isClicked(mx, my) {
		if (this.label == 'new') {
			// Decides if the button has been clicked
			let xClicked = this.x < mx && mx < this.x + this.xsize;
			let yClicked = this.y < my && my < this.y + this.ysize;
			return xClicked && yClicked;
		}
	}

	whenClicked() {
		if (this.label == 'new') {
			master.newGame();
		}
	}

	display() {
		// Display the panel
		if (this.label == 'new') {
			fill(50);
			stroke(255);
			rect(this.x, this.y, this.xsize, this.ysize);
		}
		noStroke();
		fill(255);
		textAlign(CENTER, CENTER);
		textStyle(BOLD);
		textSize(18);
		text(this.text, this.x + this.xsize / 2, this.y + this.ysize / 2);
	}
}
