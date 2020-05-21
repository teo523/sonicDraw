var socket;
var lineThickness;
var lineColor = [];
var cursorX;
var cursorY;
var headX=0;
var particles = [];
var osc = [];
var isOn = [];
let icon1,icon2,icon3,icon4;
var option = 1;

function preload() {
    icon1 = loadImage('images/icon1.png');
    icon2 = loadImage('images/icon2.png');
    icon3 = loadImage('images/icon3.png');
    icon4 = loadImage('images/icon4.png');

}

function setup() {
    var canv = createCanvas(windowWidth, windowHeight);
    background(255,255,255);
     
    loadImage('images/icon1.ong', img => {
    
  });

   


    var data = {
        thickness: lineThickness,
        color: lineColor
    };
    //socket.emit('changeSlider', data);

    //socket.on('mouse', newDrawing);
}

function newDrawing(data) {
    noStroke();
    //fill(data.color[0], data.color[1], data.color[2]);
}

function mousePressed() {
    if(mouseY<=5*height/6){
    cursorX = mouseX;
    cursorY = mouseY;
    particles.push(new Particle(mouseX, mouseY));
    if (option == 1){
        osc.push(new p5.Oscillator('sine'));
        lineColor.push([255,0,0]);
    }
    else if (option == 2){
        osc.push(new p5.Oscillator('sawtooth'));
        lineColor.push([180,0,60]);
    }
    else if (option == 3){
        osc.push(new p5.Oscillator('triangle'));
        lineColor.push([60,0,180]);
    }
    else if (option == 4){
        osc.push(new p5.Oscillator('square'));
        lineColor.push([0,0,255]);
    }
    isOn.push(0);
    console.log(particles);}
    else{
        if (mouseX<width/4)
            option = 1;
        if (mouseX>width/4 && mouseX<width/2)
            option = 2;
        if (mouseX>width/2 && mouseX<3*width/4)
            option = 3;
        if (mouseX>3*width/4)
            option = 4;
    }

}

function mouseDragged() {
    var mousex = mouseX;
    var mousey = mouseY;
    cursorX = 0.90*cursorX+0.10*mousex;
    cursorY = 0.90*cursorY+0.10*mousey;
    var data = {
        x: cursorX,
        y: cursorY,
    };
    //socket.emit('mouse', data);
    for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    }
 
    noStroke();
    //fill(lineColor[0], lineColor[1], lineColor[2]);
    //ellipse(cursorX, cursorY, lineThickness, lineThickness);
}

function draw() {
    background(255,123,0);
    menuButtons();
    if (mouseIsPressed && mouseY<=5*height/6) {
        mouseDragged();
    }
    stroke(0,0,0);
    line(headX,0,headX,height);
    headX+=10;
    if (headX>=width)
        headX=0;
    playOscillators();

    for (var i = 0; i < particles.length; i++) {
    particles[i].show(lineColor[i]);
  }
}



// Daniel Shiffman
// code for https://youtu.be/vqE8DMfOajk

function Particle(x, y) {
  this.x = x;
  this.y = y;

  this.history = [];

  this.update = function() {
    this.x = cursorX;
    this.y = cursorY;

 
    var v = createVector(this.x, this.y);
    this.history.push(v);
    if (this.history.length > 100) {
      //this.history.splice(0, 1);
    }
  };

  this.show = function(lc) {
    stroke(222,222,222);
    fill(250, 250,255);
    ellipse(this.x, this.y, 24, 24);

    /*noFill();
    beginShape();
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      //fill(random(255));
      //ellipse(pos.x, pos.y, i, i);
      vertex(pos.x, pos.y);
    }
    endShape();*/

    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      noStroke();
      fill(lc[0], lc[1], lc[2]);
      ellipse(pos.x, pos.y, 10, 10);
    
    }
  };
}


function playOscillators() {

for (var i=0;i<particles.length;i++) {
var Playing = 0;
    for (var j=0;j<particles[i].history.length;j++) {
        if (abs(particles[i].history[j].x-headX)<5){
            Playing = 1;
            osc[i].freq(map(particles[i].history[j].y,height,0,80,1600));
            if (isOn[i] == 0){
            console.log("osc started");
            osc[i].amp(0.03);
            osc[i].start();  
            isOn[i]=1;}
            break;
        }
    
    }
if (isOn[i]==1 && Playing==0){
    osc[i].amp(0,0.3);
    isOn[i] = 0;
    console.log("osc ended");
}

}
}

function menuButtons() {
    var bHeight=height/6;
    stroke(0);
    strokeWeight(4);
    
    fill(255,0,0);
    if (option == 1)
        stroke(255);
    rect(0,height - bHeight,width/4,bHeight);
    icon1.resize(bHeight/2,bHeight/2);
    image(icon1, width/8-icon1.width/2,height-bHeight/2-icon1.height/2);
    noStroke();

    if (option == 2)
        stroke(255);
    fill(180,0,60);
    rect(width/4,height - bHeight,width/4,bHeight);
    icon2.resize(bHeight/2,bHeight/2);
    image(icon2, 3*width/8-icon2.width/2,height-bHeight/2-icon1.height/2);
    noStroke();

    if (option == 3)
        stroke(255);
    fill(60,0,180);
    rect(width/2,height - bHeight,width/4,bHeight);
    icon3.resize(bHeight/2,bHeight/2);
    image(icon3, 5*width/8-icon1.width/2,height-bHeight/2-icon1.height/2);
    noStroke();

    if (option == 4)
        stroke(255);
    fill(0,0,255);
    rect(3*width/4,height - bHeight,width/4,bHeight);
    icon4.resize(bHeight/2,bHeight/2);
    image(icon4, 7*width/8-icon1.width/2,height-bHeight/2-icon1.height/2);
    noStroke();

}
