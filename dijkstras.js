/* 
	Stephen Rinkus 
	Dijkstra's shortest-path algorithm
	
	Graph 1:             				Graph 2: 
	                                    
		DIRECTED - 5 edges, 4 nodes     	DIRECTED - 11 edges, 9 nodes
		() = weight (aka dist, score)   	
		                                		   1
		  (1) ->  2 - > (6)             		/  |  \
	     /	      |		   \            	  2    3 -> 4
		1 	     (2)	    4           	 /  \ |     |
	     \        V		   /            	6     5 ->  7
		  (4) - > 3 - > (3)             		 |      |
	                                    		 8 	   9         		 
*/

import { Queue } from "./Queue.js";
import { MinHeap } from "./MinHeap.js";
import { LinkedList } from "./LinkedList.js"; 
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { performance } = require('perf_hooks');
const util = require('util');
const fs = require('fs');
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Main

class Dijkstra {
	
	constructor(graph){
		this.graph = graph;
	}
	
	//Shorest path finder
	dijkstras(start) {
		
		const minHeap = new MinHeap();	//minheap nodes: (vertex, distance), bubbled by distance
		const explored = new Set();		//discovery map, no dupes allowed
		const dists = {};				//shortest distances tracker (vertex map to distance)
		const paths = {};				//(optional) keeps track of path routes
		const MAX = Number.MAX_VALUE;	//Number.MAX_VALUE, 99999
		
		//initialize heap
		for (const vert of this.graph.vertices.keys()) {			
			minHeap.insertHeapNode(vert, MAX);			
			dists[vert] = MAX;
		} 
		
		//initialize root
		minHeap.heap[0].dist = 0;
		minHeap.vertLocs[start] = 0;
		dists[start] = 0;
		
		//explore one vertex per loop until none left to explore
		while (minHeap.size > 0){

			//extract the min vertex
			const vert = minHeap.extractMin().vert;
			const neighbors = this.graph.vertices.get(vert);
			
			explored.add(vert);
			
			//traverse all adjacent verts and update distances where needed
			let current = neighbors.head;
			while (current) {
				let neighbor = current.value.tail;
				if (!explored[neighbor]) {
					explored.add(neighbor);
					if (current.value.dist + dists[vert] < dists[neighbor]){
						dists[neighbor] = current.value.dist + dists[vert];
						minHeap.decreaseKey(neighbor, dists[neighbor]);
					}
				}
				current = current.next;
			}  
		}  
		
		//review the results
		const destinations = [7,37,59,82,99,115,133,165,188,197];
		let result = "";
		for (let dest of destinations) {
			result = [...result, (dists[dest])];
		}
		console.log(result); 

	}
	
}

class Graph {

	constructor(graphType = "DIRECTED") {
		this.vertices = new Map();
		this.graphType = graphType;  
	};	
	
	//Add (and return) a vertex to the graph...
	addVertex(vert) {
		
		if (!this.vertices.has(vert)){
			this.vertices.set(vert, new LinkedList());	
			return vert;
		}
		
		return null;
		
	};

	//Add (and return) an edge to the graph...allows addition of new vertices
	addEdge(v1, v2, dist) {
		
		this.addVertex(v1);
		this.addVertex(v2);

		let edge = new Edge(v2, dist);
		this.vertices.get(v1).insertAt(edge, 0);
		
		return null;
	};

	//Walk through each key in the vertices map, and print its linked list of neighbors
	printGraph() {
		console.log(this.graphType + " GRAPH: ");
		for (let [vertex] of this.vertices){
			console.log(Number(vertex));
			this.vertices.get(vertex).print();
		}
	};
	
}

class HeapNode {

	constructor(vert, dist){
		this.vert = vert;
		this.dist = dist;
	}

}

class Edge {
	
	//each edge reaches out to a tail, with a distance
	constructor(tail, dist){
		this.tail = tail;
		this.dist = dist;
	}
	
}

//Take input file and output a directed graph
const parseFile = async (file) => {

	const lines = (await util.promisify(fs.readFile)(file)).toString().split('\r\n');
	const graph = new Graph("DIRECTED");

	lines.map(line => {

		if (!line) { return null; }
		
		//convert each (destination,distance) pair into an Edge object
		let [vert, ...edges] = line.split('\t').filter(edge => edge).map(edge => new Edge(edge.split(",")[0], edge.split(",")[1]));
		
		//map the vertex to its edges
		edges.forEach(edge => {
			graph.addEdge(Number(vert.tail), Number(edge.tail), Number(edge.dist));
		});
		
	});

	return graph;
}; 

///////////////////////////////////////////////////////////////////////////////////////////////////
//Driver
/*	
	Graph 1:             				Graph 2: 
	                                    
		DIRECTED - 5 edges, 4 nodes     	DIRECTED - 11 edges, 9 nodes
		() = weight (aka dist, score)   	
		                                		   1
		  (1) ->  2 - > (6)             		/  |  \
	     /	      |		   \            	  2    3 -> 4
		1 	     (2)	    4           	 /  \ |     |
	     \        V		   /            	6     5 ->  7
		  (4) - > 3 - > (3)             		 |      |
	                                    		 8 	   9         		 
*/

console.log("Starting Dijsktra's...");
 
parseFile('./dijkstraData.txt').then((graph) => {
	
	const dijkstra = new Dijkstra(graph);
	const startVert = 1;
	const startTime = performance.now();
	
	dijkstra.dijkstras(startVert); 
	
	const endTime = performance.now();
	
	console.log(`Dijkstras took ${endTime - startTime} milliseconds`);   // ~ 4.17 milliseconds
	
});









