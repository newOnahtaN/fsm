function strucutreFunction(){
	
	var diagram = JSON.parse(localStorage['fsm']);

	console.log(diagram);

	//Check coherent diagram
	//var coherent = false;
	var hasStart = false;
	var hasEnd = false;
	var startNode = -1;
	var endNode = -1;

	for (var i = 0; i < diagram.nodes.length; i++) {
		if (diagram.nodes[i].position == "startnode"){
			hasStart = true;
			startNode = i
		} else if (diagram.nodes[i].position == "endnode"){
			hasEnd = true;
			endNode = i;
		}
	};

	//Find adjacency vector of all nodes
	//Set up adjacency vector
	var adjacencies = [];
	for (var i = 0; i < diagram.nodes.length; i++) {
		adjacencies[i] = [];
	}

	//Construct adjacency vector
	for (var i = 0; i < diagram.links.length; i++) {
		if (diagram.links[i].type == "Link") {
	  		adjacencies[diagram.links[i].nodeA].push(diagram.links[i].nodeB);
	  		adjacencies[diagram.links[i].nodeB].push(diagram.links[i].nodeA);
	  }
	}

	var errorFlag = 0;

	//Catch possible errors
	try { 
		//Look for start/end nodes
	    if(startNode == -1)  throw "Must have start node";
	    if(endNode == -1) throw "Must have end node";

	    //Look for repeated nodes
	    var nodeNames = [];
	    for (var i = 0; i < diagram.nodes.length; i++) {
	    	if (nodeNames.includes(diagram.nodes[i].text) && !diagram.nodes[i].isJoint) {
	    		throw "Structure function only available if no repeated nodes";
	    	} else {
	    		nodeNames.push(diagram.nodes[i].text);
	    	}
	    }

	    //Look for isolated nodes
	    for (var i = 0; i < adjacencies.length; i++) {
			if (adjacencies[i].length < 1) throw "Structure function only available if block diagram is connected";
		}
	}
	catch(err) {
	    errorFlag = err;
	}

	if (!errorFlag) {
		//Make list of path vectors
		//Determine Path vectors via recursive BFS/DFS
		var pathVector = [];
		var arrayOfPathVectors = [];

		for (var i = 0; i < diagram.nodes.length; i++) {
			pathVector.push(0);
		}

		function create_path_vectors(root, goal, vector, visited) {
			//If reached end, add path vector to list
			if (root == goal) {
				arrayOfPathVectors.push(vector);
			} else {
				//Add node to path vector
			    var newVector = Array.from(vector);
			    newVector[root] = 1;
			    //Add node to visited
			    var S = Array.from(visited);
			    S.push(root);
			    //Go to end node if possible, otherwise visit all possible nodes
			    if (adjacencies[root].includes(goal)) {
			    	create_path_vectors(adjacencies[root][adjacencies[root].indexOf(goal)], endNode, newVector, S);
			    } else {
				    for (var i = 0; i < adjacencies[root].length; i++) {
				    	if (!S.includes(adjacencies[root][i])) {
				    		create_path_vectors(adjacencies[root][i], endNode, newVector, S);
				    	}
				    }
				}
			}
		}

		create_path_vectors(startNode, endNode, pathVector, []);

		//Execute minimal path set approach
		var outputString = "";
		for (var i = 0; i < arrayOfPathVectors.length; i++) {
			//Ignore if not minimal
			var minimal = 1;
			for (var k = 0; k < arrayOfPathVectors.length; k++) {
				var hasFewer = 0;
				var hasMore = 0;
				for (var l = 0; l < arrayOfPathVectors[i].length; l++) {
					if (diagram.nodes[l].position != "startnode" && diagram.nodes[l].position != "endnode" && !diagram.nodes[l].isJoint) {
						if (arrayOfPathVectors[i][l] < arrayOfPathVectors[k][l]) {
							hasFewer = 1;
						} else if (arrayOfPathVectors[i][l] > arrayOfPathVectors[k][l]) {
							hasMore = 1;
						}
					}
				}
				if (hasMore && !hasFewer) {
					minimal = 0;
				}
			}
			if (minimal) {
				//Remove start node from vector
				arrayOfPathVectors[i][startNode] = 0;
				outputString = outputString + "(1 - ";
				for (var j = 0; j < arrayOfPathVectors[i].length; j++) {
					if (arrayOfPathVectors[i][j] == 1 && !diagram.nodes[j].isJoint) {
						subscript = diagram.nodes[j].text
						outputString = outputString + "x_{" + subscript + "}";
					}
				}
				outputString = outputString + ")";
			}
		}

		console.log("1 - " + outputString);
	 	return "1 - " + outputString;

	} else {
		console.log(errorFlag);
	  
		return errorFlag;
	}
}