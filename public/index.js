function setup() {

createCanvas(windowWidth,windowHeight);

}



function draw() {
	background(0);
	stroke(250,100,0);

	for (i = 0; i< 40; i++){
var a = random(height/300);
//strokeWeight(random(5));
line(0,height/40 * i + a ,width, height/40 * i + a);

}

}