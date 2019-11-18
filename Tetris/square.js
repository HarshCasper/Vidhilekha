class Square {
	// A square has an index on the grid, and also am index relative to
	// the central square of the piece it belongs to
	constructor(i, j, irel, jrel) {
		this.size = gridSize;

		// This is the position of the square on the overall grid
		this.i = i;
		this.j = j;

		// Position of the square relative to the central square of the piece
		this.iRelative = irel;
		this.jRelative = jrel;

		// Overall position in the canvas
		this.x = arena.xstart + this.j * this.size;
		this.y = arena.ystart + this.i * this.size;

		this.show = false;
	}

	move(where) {
		// Just move the square, because this code is only reached when all
		// the conditions have been met
		if (where == 'down') {
			this.i++;
		}
		else if (where == 'right') {
			this.j++;
		}
		else if (where == 'left') {
			this.j--;
		}
	}

	maintain(center) {
		// Receives an updated center square and updates the indices and positions
		this.i = center.i + this.iRelative;
		this.j = center.j + this.jRelative;
		this.x = arena.xstart + this.j * this.size;
		this.y = arena.ystart + this.i * this.size;
	}

	draw() {
		if (this.show) {
			fill(0, 255, 0);
			stroke(0);
			rect(this.x, this.y, this.size, this.size);
		}
	}

	notAllowed() {
		// Decides if the square is allowed to exist with the indices it has
		if (this.i < 0 || this.i >= arena.ynum || this.j < 0 || this.j >= arena.xnum) {
			return true;
		}

		// If the square is on a square of the bottom, it is also not allowed
		if (arena.grid[this.i][this.j].show) {
			return true;
		}
		return false;
	}
}
