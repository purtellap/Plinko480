class Ball {
	
	/**
	* constructor for Ball
	* @constructor
	* @param {THREE.Object3} object3 - THREE.JS polygon mesh object
	* @param {THREE.Vector3} velocity - velocity (direction and magnitude) in units of distance per second
	* @param {boolean} isFalling - determines whether the user has dropped the ball or not
	* @param {boolean} ended - determines whether the ball has landed
	*/
	constructor(object3, radius, velocity){
		this.object3 = object3;
		this.radius = radius;
		this.velocity = velocity;
		this.isFalling = false;
		this.ended = false;
	}

	/**
	* moves shape for current frame of animation.
	* @param {float} elapsedTimeSeconds - elapsed time of one frame as a fraction of a second.
	* @param {THREE.Box3} boundBox - bounding box that represents the 
	* minimum-to-maximum endpoints of
	* the region of space within which the animated objects will move.
	* post-condition: increments position of the THREE.Object3 by
	* elapsedTimeSeconds * velocity and determines if this object
	* has gone out of boundBox. 
	* @param {list} pegs - list of all pegs in the scene
	* @param {list} walls - list of all the walls in the scene
	* @param {float} wallheight - height of the walls
	*/
	move(elapsedTimeSeconds, boundBox, pegs, walls, wallheight){
		
		// Collision
		// I used an idea based on previous work from CITA 495
		var damping = 3;
		var traction = .8;
		var	gravity = -0.2;
		var mass = 4;
		
		// Boundaries
		if (this.object3.position.x + this.radius >= boundBox.max.x) {
			this.velocity.x = -this.velocity.x;
			this.object3.position.x = boundBox.max.x - this.radius;
		}
		else if (this.object3.position.x - this.radius <= boundBox.min.x) {
			this.velocity.x = -this.velocity.x;
			this.object3.position.x = boundBox.min.x + this.radius;
		}
		/*if (this.object3.position.y + this.radius >= c.height) {
			this.velocity.y = -this.velocity.y * damping / mass;
			this.object3.position.y = c.height - this.radius;
			this.velocity.x *= traction;
		} */
		if (this.object3.position.y - this.radius <= boundBox.min.y) {
			this.velocity.y = -this.velocity.y * damping / mass;
			this.object3.position.y = boundBox.min.y + this.radius - .01;
			this.velocity.x *= traction;
			this.velocity.y *= traction;
		}
		
		// Pegs
		var xDamp = .9;
		var pegRadius = this.radius * .1;
		for (var i = 0; i < pegs.length; i++) {
					
			var pegX = pegs[i].x;
			var pegY = pegs[i].y;
			var tempx = this.object3.position.x;
			var tempy = this.object3.position.y;
			
			var distance = Math.sqrt( Math.pow((tempx-pegX), 2) + Math.pow((tempy-pegY), 2) );
			
			// collision occured
			if(distance < this.radius + pegRadius){
				
				var deltaX = tempx - pegX;
				var deltaY = tempy - pegY;
				var total = Math.abs(deltaX) + Math.abs(deltaY);
				var xBias = Math.abs(deltaX)/total;
				var yBias = Math.abs(deltaY)/total;
				
				// on right side of peg
				if(deltaX > 0){
					// going right
					if(this.velocity.x > 0){
						//this.velocity.x += -this.velocity.x * xBias;
						//this.object3.position.x += distance * yBias;
					}
					// going left
					else{
						this.velocity.x = -this.velocity.x * xDamp;
						//this.object3.position.x += distance * xBias;
					}	
				}
				// on left side of peg
				else{
					// going right
					if(this.velocity.x > 0){
						this.velocity.x = -this.velocity.x * xDamp;
						//this.object3.position.x -= distance * xBias;
					}
					// going left
					else{
						//this.velocity.x = -this.velocity.x * xBias;
						//this.object3.position.x -= distance * yBias;
					}	
				}
				// above peg
				if(deltaY > 0){
					this.velocity.y = -this.velocity.y * yBias;
					this.object3.position.y += deltaY * yBias;	
				}
				// below peg
				else{
					this.object3.position.y -= deltaY;
				}
				
			}

		}
		
		// Walls
		for (var i = 0; i < walls.length; i++) {
			
			var wallX = walls[i].x;
			var wallY = walls[i].y;
			var tempx = this.object3.position.x;
			var tempy = this.object3.position.y;
			var deltaX = tempx - wallX;
			var deltaY = tempy - wallY;
			var distance = Math.sqrt( Math.pow((tempx-wallX), 2) + Math.pow((tempy-wallY), 2) );
			
			// collision occured
			if(distance < this.radius + pegRadius){
				var total = Math.abs(deltaX) + Math.abs(deltaY);
				var xBias = Math.abs(deltaX)/total;
				var yBias = Math.abs(deltaY)/total;
				
				// on right side
				if(deltaX > 0){
					// going right
					if(this.velocity.x > 0){
						//this.velocity.x += -this.velocity.x * xBias;
						//this.object3.position.x += distance * xBias;
					}
					// going left
					else{
						this.velocity.x = -this.velocity.x * xDamp;
						//this.object3.position.x += distance * xBias;
					}	
				}
				// on left side
				else{
					// going right
					if(this.velocity.x > 0){
						this.velocity.x = -this.velocity.x * xDamp;
						//this.object3.position.x -= distance * xBias;
					}
					// going left
					else{
						//this.velocity.x = -this.velocity.x * xBias;
						//this.object3.position.x -= distance * xBias;
					}	
				}
				
			}
					
		}
		
		// Movement 
		if(!this.isFalling){	
			this.object3.position.x += elapsedTimeSeconds * this.velocity.x;
		}
		else{
			this.object3.position.x += elapsedTimeSeconds * this.velocity.x;
			this.object3.position.y += elapsedTimeSeconds * this.velocity.y;
			this.velocity.y += gravity;
		}
		
		// Checks if landed
		if (this.object3.position.y - this.radius - .1 <= boundBox.min.y && this.velocity.y < 0) {
			this.ended = true;
			
		}
		
	}
	
}