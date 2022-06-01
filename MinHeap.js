/* 
	Stephen Rinkus
	MinHeap - tailored for Dijkstra's  
*/

class MinHeap {

	//Storing heap structure in an array
	constructor(){
		this.heap = [];			
		this.size = 0;
		this.vertLocs = {};  	//mappings verts to their Heap positions
	}
	
	//Insert HeapNode...modified to take vert/value and place a new HeapNode at the end of heap
	insertHeapNode(vert, val) {
	
		//this approach simply tacks the new node onto the end, since all nodes start with the same value
		this.heap.push(new HeapNode(vert, val));
		this.vertLocs[vert] = this.size;
		this.size++;
	}
	
	//Swap two nodes and their position trackers
	swap(node1, node2){
	
		//swap the vertex position locations in the map
		this.vertLocs[this.heap[node2].vert] = node1;
		this.vertLocs[this.heap[node1].vert] = node2;
		
		//swap the actual nodes within the Heap
		[this.heap[node1], this.heap[node2]] = [this.heap[node2], this.heap[node1]];
	}
	 
	//Bubble up HeapNode...decreaseKey() is followed by a bubbleUp()...
	bubbleUp(index) {
		
		let parentIdx = Math.floor((index + 1) / 2) - 1; 
		let currIdx = index;
		
		//keep swapping the node upwards until its parent's dists are no longer greater
		while (currIdx > 0 && this.heap[parentIdx].dist > this.heap[currIdx].dist) {
			
			this.swap(currIdx, parentIdx);
			
			//advance up
			currIdx = parentIdx;
			parentIdx = Math.floor((currIdx + 1) / 2) - 1; 
		}
	}
	
	//Sink a node down...extractMin is followed by a bubbleDown, after last element is placed at top...
	bubbleDown(index = 0){
	
		let swap = true;					//boolean swap status, so code knows when to exit loop
		let leftChildIndex, rightChildIndex;
		const length = this.heap.length;
		
		//while downward swaps are still possible
		while (swap) {
						
			swap = false;		//code will need to swap in order to re-enter loop				
						
			let min = index;
			leftChildIndex = (2 * index) + 1;
			rightChildIndex = (2 * index) + 2;
			
			if (leftChildIndex < length && this.heap[leftChildIndex].dist < this.heap[index].dist) {
				min = leftChildIndex;
			}

			if (rightChildIndex < length && this.heap[rightChildIndex].dist < this.heap[min].dist){
				min = rightChildIndex;	
			}
						
			//if new min was detected, do the needed swap
			if (min != index) {
				this.swap(index, min);	//swap heap nodes and index mappings
				index = min;			//advnace downwards
				swap = true;
			} 
		}
	};
	
	//Remove and return the min heap element, and re-settle the remaining heap to a valid state...
	extractMin(){
	
		const min = this.heap[0];			//minimum value in heap, to be returned at the end
		this.heap[0] = this.heap.pop();		//override first element with last
		this.vertLocs[this.heap[0].vert] = 0;
		this.bubbleDown();					//push the new-found root node downwards till it's in place
		this.size--;
		
		return min;
	}
	
	//Lower a vertex's stored distance..followed by a bubbleUp()
	decreaseKey(vert, dist){
	
		const index = this.vertLocs[vert];	//find the location of the vertex to be changed
		this.heap[index].dist = dist;		//update the vert's dist within the heap
		this.bubbleUp(index);				//allow the heap to restablish heap property

	}
	
	//Boolean check if the heap is empty
	isEmpty(){
		return this.heap.length < 1;
	}
	
}

class HeapNode {

	constructor(vert, dist){
		this.vert = vert;
		this.dist = dist;
	}

}

export { MinHeap };



