class Sort {

	constructor (canvas) {
		this.canvas = canvas;
		this.defaultColor = '#757575';
		this.activeColor = '#FAFAFA';
		this.compareColor = '#18FFFF';
		this.swapColor = '#E040FB';
		this.pivotColor = '#FFFF8D';
		this.tempColor = '#B2FF59';
		this.sort = 'quick';
		this.size = 20;
		this.interval = 100;
		this.animate = 0;
		this.swapCount = 0;
		this.compareCount = 0;
		this.animateNext = this.animateNext.bind(this);
	}

	swap (arr, i, j) {
		let temp = arr[i];
	  arr[i] = arr[j];
	  arr[j] = temp;
	}

	/*----------------- FISHER YATES SHUFFLE -----------------*/
	shuffle () {
		let j;
	  for (let i = this.arr.length; i; i--) {
	    j = Math.floor(Math.random() * i);
	    this.swap(this.arr, i - 1, j);
	  }
	}

	buildArray () {
		this.arr = [];
		this.displayArr = [];
		this.next = [];
		//create and shuffle array
		for (let i = 1; i < +this.size + 1; i++) {
			this.arr.push(i);
		}
		this.shuffle();
		//create display array
		for (let i = 0; i < this.size; i++) {
			this.displayArr.push({
				value: this.arr[i],
				color: this.defaultColor
			});
		}
	}

	canvasArray (iSwap, jSwap) {
		let ctx = this.canvas.getContext('2d');
		//clear canvas
		ctx.fillStyle = '#212121';
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  	//draw array elements
  	let yRatio = (this.canvas.height - 50) / this.arr.length,
  			space = this.canvas.width / this.arr.length,
  			width = space / 2,
  			x = space / 4;
  	for (let i = 0; i < this.arr.length; i++) {
  		//set swap animation variables
  		if (i === iSwap) {
  			var iSwapX = x;
  			var iSwapY = yRatio * this.displayArr[i].value;
  		}
  		if (i === jSwap) {
  			var jSwapX = x;
  			var jSwapY = yRatio * this.displayArr[i].value;
  		}
  		this.drawArrayElement(ctx, i, x, yRatio, width);
  		x += space;
  	}
  	//swapping animation loop
  	const animateSwap = () => {
  		//clear array elements
  		ctx.fillStyle = '#212121';
  		ctx.fillRect(iSwapX - 1, 0, width + 2, this.canvas.height);
  		ctx.fillRect(jSwapX - 1, 0, width + 2, this.canvas.height);
  		//redraw array elements in-between swapping elements
  		let x = (space / 4) + (space * (iSwap + 1));
  		for (let i = iSwap + 1; i < jSwap; i++) {
  			this.drawArrayElement(ctx, i, x, yRatio, width);
	  		x += space;
  		}
  		//redraw swapping elements
  		if (iSwap < jSwap) {
	  		iSwapX += Math.min(pixelDistance, Math.abs(jSwapXStart - iSwapX));
	  		jSwapX -= Math.min(pixelDistance, Math.abs(iSwapXStart - jSwapX));
  		} else {
  			iSwapX -= Math.min(pixelDistance, Math.abs(jSwapXStart - iSwapX));
	  		jSwapX += Math.min(pixelDistance, Math.abs(iSwapXStart - jSwapX));
  		}
  		ctx.fillStyle = this.swapColor;
  		ctx.fillRect(iSwapX, this.canvas.height - iSwapY, width, iSwapY);
  		ctx.fillRect(jSwapX, this.canvas.height - jSwapY, width, jSwapY);
  		//check if animation is complete
  		if (iSwap < jSwap && jSwapX > iSwapXStart) {
  			window.requestAnimationFrame(animateSwap);
  		} else if (iSwap > jSwap && jSwapX < iSwapXStart) {
  			window.requestAnimationFrame(animateSwap);
  		}
  	}
  	//start animation loop
  	if (jSwap) {
  		let intervalAdjust;
  		//increase animation swap speed for more distant elements and adjust to interval and canvas size
  		if (+this.interval === 10) intervalAdjust = 600;
  		if (+this.interval === 50) intervalAdjust = 300;
  		if (+this.interval === 100) intervalAdjust = 200;
  		if (+this.interval === 500) intervalAdjust = 100;
  		if (+this.interval === 1000) intervalAdjust = 50;
  		var iSwapXStart = iSwapX;
  		var jSwapXStart = jSwapX;
  		var pixelDistance = (Math.abs(iSwapXStart - jSwapXStart) / this.canvas.width) * intervalAdjust;
  		window.requestAnimationFrame(animateSwap);
  	}
	}

	drawArrayElement (ctx, i, x, yRatio, width) {
		let y = yRatio * this.displayArr[i].value;
		ctx.fillStyle = this.displayArr[i].color;
		ctx.fillRect(x, this.canvas.height - y, width, y);
	}

	animateNext () {
		if (!this.next.length) {
			this.canvasArray();
			return;
		}

		let next = this.next.shift(),
				animate = next[0],
				i = next[1],
				j = next[2];
		if (animate === 'active') {
			for (let k = i; k <= j; k++) {
				if (this.displayArr[k].color !== this.pivotColor && this.displayArr[k].color !== this.tempColor) {
					this.displayArr[k].color = this.activeColor;
				}
			}
			this.canvasArray();
		} else if (animate === 'inactive') {
			for (let k = i; k <= j; k++) {
				this.displayArr[k].color = this.defaultColor;
			}
			this.canvasArray();
		} else if (animate === 'selectPivot') {
			this.displayArr[i].color = this.pivotColor;
			this.canvasArray();
		} else if (animate === 'unselectPivot') {
			this.displayArr[i].color = this.activeColor;
			this.canvasArray();
		} else if (animate === 'compare') {
			this.colorSwap(this.compareColor, i, j);
			this.canvasArray();
			this.colorSwap(this.activeColor, i, j);
		} else if (animate === 'swap') {
			this.canvasArray(i, j);
			this.swap(this.displayArr, i, j);
			this.colorSwap(this.activeColor, i, j);
		} else if (animate === 'temp') {
			this.displayArr[i].color = this.tempColor;
			this.canvasArray();
		} else if (animate === 'assign') {
			this.displayArr[i].value = j;
			this.displayArr[i].color = this.defaultColor;
			this.canvasArray();
		}
	}

	colorSwap (type, i, j) {
		if (this.displayArr[j]) {
			if (this.displayArr[i].color !== this.pivotColor && this.displayArr[i].color !== this.tempColor) this.displayArr[i].color = type;
			if (this.displayArr[j].color !== this.pivotColor && this.displayArr[j].color !== this.tempColor) this.displayArr[j].color = type;
		}
	}

	displaySwap (i, j) {
		this.swapCount++;
		let temp = this.arr[i];
	  this.arr[i] = this.arr[j];
	  this.arr[j] = temp;
		this.next.push(['swap', i, j]);
	}

	compare (i, j) {
		this.compareCount++;
		this.next.push(['compare', i, j]);
		return this.arr[j] < this.arr[i];
	}

	assign (i, value) {
		this.arr[i] = value;
		this.next.push(['assign', i, value]);
	}

	displayTemp (temp, i) {
		temp.push(this.arr[i]);
		this.next.push(['temp', i]);
	}

	selectPivot (i) {
		this.next.push(['selectPivot', i]);
	}

	active (left, right) {
		this.next.push(['active', left, right]);
	} 

	inactive (left, right) {
		this.next.push(['inactive', left, right]);
	}

	/*----------------- BUBBLESORT -----------------*/
	bubbleSort () {
		this.active(0, this.arr.length - 1);
	  let bubbleLength = this.arr.length;
	  let sorted = false;
	  for (let i = 0; i < this.arr.length && !sorted; i++) {
	    sorted = true;
	    bubbleLength--;
	    for (let j = 0; j < bubbleLength; j++) {
	    	if (this.compare(j, j + 1)) {
	        sorted = false;
	        this.displaySwap(j, j + 1);
	      }
	    }
	    this.inactive(bubbleLength, this.arr.length - 1);
	  }
	  this.inactive(0, bubbleLength);
	}

	/*----------------- INSERTIONSORT -----------------*/
	insertionSort () {
		let j;
	  for (let i = 1; i < this.arr.length; i++) {
	  	j = i;
	    while (this.arr[j - 1] && this.compare(j - 1, j)) {
	    	//while insertion sort does not use swaps, they make it easier to visualize the comparison against the temp value
	      this.displaySwap(j - 1, j);
	      j--;
	    }
	  }
	  this.inactive(0, this.arr.length);
	}

	/*----------------- QUICKSORT -----------------*/
	partition (left, right) {
		this.active(left, right);
	  let i, j;
	  //choose random pivot and swap with first element in array partition
	  let pivot = Math.floor(Math.random() * (right - left) + left);
	  this.selectPivot(pivot);
	  if (left !== pivot) this.displaySwap(left, pivot);

	  for (i = left + 1, j = left + 1; j <= right; j++) {
	    if (this.compare(left, j)) {
	    	if (i !== j) this.displaySwap(i, j);
	      i++;
	    }
	  }

	  if (left !== i - 1) this.displaySwap(left, i - 1);
	  this.inactive(left, right);
	  return i - 1;
	}

	quickSort (left, right) {
		left = left !== undefined ? left : 0;
		right = right !== undefined ? right : this.arr.length - 1;
	  if (left >= right) return;
	  let pivot = this.partition(left, right);
	  this.quickSort(left, pivot - 1);
	  this.quickSort(pivot + 1, right);
	}

	/*----------------- MERGESORT -----------------*/
	mergeSort (left, right) {
	  left = left !== undefined ? left : 0;
	  right = right !== undefined ? right : this.arr.length - 1;
	  if (left >= right) return;
	  let middle = Math.floor(right / 2 + left / 2);
	  this.mergeSort(left, middle);
	  this.mergeSort(middle + 1, right);
	  this.merge(left, middle, right);
	}

	merge (left, middle, right) {
		this.active(left, right);
	  let temp = [],
	      i = left,
	      j = middle + 1
	  while (i <= middle && j <= right) {
	    if (this.compare(i, j)) {
	    	this.displayTemp(temp, j);
	      j++;
	    } else {
	    	this.displayTemp(temp, i);
	      i++;
	    }
	  }
	  while (i <= middle) {
	  	this.displayTemp(temp, i);
	    i++;
	  }
	  while (j <= right) {
	  	this.displayTemp(temp, j);
	    j++;
	  }
	  for (let k = left, l = 0; k <= right; k++, l++) {
	    this.assign(k, temp[l]);
	  }
	}

	/*----------------- HEAPSORT -----------------*/
	buildMaxHeap () {
	  this.arr.heapsize = this.arr.length - 1;
	  for (let i = Math.floor(this.arr.length / 2); i > -1; i--) this.maxHeapify(i);
	}

	maxHeapify (i) {
	  let left = 2 * i,
	      right = 2 * i + 1,
	      max = i;

	  if (left <= this.arr.heapsize && this.compare(left, max)) max = left;
	  if (right <= this.arr.heapsize && this.compare(right, max)) max = right;
	  if (max !== i) {
	    this.displaySwap(i, max);
	    this.maxHeapify(max);
	  }
	}

	heapSort () {
		this.active(0, this.arr.length - 1);
	  this.buildMaxHeap();
	  for (let i = this.arr.length - 1; i > 0; i--) {
	    this.displaySwap(0, i)
	    this.inactive(this.arr.heapsize, this.arr.length - 1);
	    this.arr.heapsize--;
	    this.maxHeapify(0);
	  }
	  this.inactive(0, 0);
	}
}

/*----------------- DOM EVENTS -----------------*/
window.onload = () => {
	//initialize canvas and array
	let canvas = document.getElementById('main-canvas');
	canvas.height = window.innerHeight;
	canvas.width = 0.85 * window.innerWidth;
	let sortVis = new Sort(canvas);
	sortVis.buildArray();
	sortVis.canvasArray();
	//initialize click and change handlers
	let e = document.getElementById("elements");
	e.onchange = () => {
		let size = e.options[e.selectedIndex].value;
		sortVis.size = size;
		sortVis.buildArray();
		sortVis.canvasArray();
	}
	document.getElementById('bubble').onclick = () => {
		sortVis.sort = 'bubble';
	}
	document.getElementById('insertion').onclick = () => {
		sortVis.sort = 'insertion';
	}
	document.getElementById('quick').onclick = () => {
		sortVis.sort = 'quick';
	}
	document.getElementById('merge').onclick = () => {
		sortVis.sort = 'merge';
	}
	document.getElementById('heap').onclick = () => {
		sortVis.sort = 'heap';
	}
	document.getElementById('reset-btn').onclick = () => {
		if (sortVis.animate) window.clearInterval(sortVis.animate);
		sortVis.buildArray();
		sortVis.canvasArray();
	}
	document.getElementById('start-btn').onclick = () => {
		//clear previous visualizations
		sortVis.swapCount = 0;
		sortVis.compareCount = 0;
		if (sortVis.animate) window.clearInterval(sortVis.animate);
		//get interval and sort and begin animation
		let e = document.getElementById("interval");
		let interval = e.options[e.selectedIndex].value;
		sortVis.interval = interval;
		sortVis.animate = window.setInterval(sortVis.animateNext, sortVis.interval);
		if (sortVis.sort === 'bubble') sortVis.bubbleSort();
		if (sortVis.sort === 'insertion') sortVis.insertionSort();
		if (sortVis.sort === 'quick') sortVis.quickSort();
		if (sortVis.sort === 'merge') sortVis.mergeSort();
		if (sortVis.sort === 'heap') sortVis.heapSort();
	}
}
