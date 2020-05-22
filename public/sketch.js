//var socket;
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
var vector = [];
var timeSteps = 500;
var thick = 1;
var bHeight;
var tWidth;
var tHeight;

function preload() {
    icon1 = loadImage('images/icon1.png');
    icon2 = loadImage('images/icon2.png');
    icon3 = loadImage('images/icon3.png');
    icon4 = loadImage('images/icon4.png');
    icon5 = loadImage('images/pen.png');
    icon6 = loadImage('images/pen.png');
    icon7 = loadImage('images/pen.png');
    icon8 = loadImage('images/pen.png');

}

function setup() {
    var canv = createCanvas(windowWidth, windowHeight);
    background(255,255,255);

    bHeight=height/6;
    tWidth=width/10;
    tHeight=height/10;

   


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
    if(mouseY<=5*height/6 && mouseX<width-tWidth){
    cursorX = mouseX;
    cursorY = mouseY;
    particles.push(new Particle(mouseX, mouseY, thick));
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
}
    else if (mouseY<=5*height/6 && mouseX>=width-tWidth){
        if (mouseY<tHeight)
            thick = 10;
        if (mouseY>=tHeight && mouseY<2*tHeight)
            thick = 7;
        if (mouseY>=2*tHeight && mouseY<3*tHeight)
            thick = 4;
        if (mouseY>3*tHeight && mouseY<4*tHeight)
            thick = 2;

    }

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
    if(particles.length>0)
        particles[particles.length-1].update();
    
 
    noStroke();
    //fill(lineColor[0], lineColor[1], lineColor[2]);
    //ellipse(cursorX, cursorY, lineThickness, lineThickness);
}

function draw() {
    background(255,123,0);
    menuButtons();
    if (mouseIsPressed && mouseY<=5*height/6 && mouseX<=width-tWidth) {
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

function Particle(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.history = [];

  this.update = function() {
    this.x = cursorX;
    this.y = cursorY;


 
    var v = createVector(this.x, this.y,this.z);
    this.history.push(v);
    if (this.history.length > 100) {
      //this.history.splice(0, 1);
    }
  };

  this.show = function(lc) {
    stroke(222,222,222);
    //fill(250, 250,255);
    //ellipse(this.x, this.y, 24, 24);

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
      ellipse(pos.x, pos.y, pos.z, pos.z);
    
    }
  };
}


function playOscillators() {

for (var i=0;i<particles.length;i++) {
var Playing = 0;
    for (var j=0;j<particles[i].history.length;j++) {
        if (abs(particles[i].history[j].x-headX)<5){
            Playing = 1;
            osc[i].freq(map(particles[i].history[j].y,5*height/6,0,80,1000));
            osc[i].amp(map(particles[i].history[j].z,1,10,0.01,0.2));
           if (isOn[i] == 0){
            //console.log("osc started");
            
            osc[i].start();  
            isOn[i]=1;}
            break;
        }
    
    }
if (isOn[i]==1 && Playing==0){
    osc[i].amp(0,0.3);
    isOn[i] = 0;
    //console.log("osc ended");
}

}
}

function menuButtons() {
    bHeight=height/6;
    tWidth=width/10;
    tHeight=height/10;
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

    //THICKNESS
    fill(130);
    if (thick == 10)
        stroke(255);
    rect(width-tWidth,0,tWidth,tHeight);
    icon5.resize(2*tHeight/3,2* tHeight/3);
    image(icon5, width-tWidth/2-icon5.width/2,tHeight/2-icon5.height/2);
    noStroke();

    fill(160);
    if (thick == 7)
        stroke(255);
    rect(width-tWidth,tHeight,tWidth,tHeight);
    icon6.resize(tHeight/2,tHeight/2);
    image(icon6, width-tWidth/2-icon6.width/2,3*tHeight/2-icon6.height/2);
    noStroke();

    fill(190);
    if (thick == 4)
        stroke(255);
    rect(width-tWidth,2*tHeight,tWidth,tHeight);
    icon7.resize(tHeight/3,tHeight/3);
    image(icon7, width-tWidth/2-icon7.width/2,5*tHeight/2-icon7.height/2);
    noStroke();

        fill(230);
    if (thick == 2)
        stroke(255);
    rect(width-tWidth,3*tHeight,tWidth,tHeight);
    icon8.resize(tHeight/4,tHeight/4);
    image(icon8, width-tWidth/2-icon8.width/2,7*tHeight/2-icon8.height/2);
    noStroke();



}

