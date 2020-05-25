//var socket;
var lineThickness;
var lineColor = [];
var cursorX;
var cursorY;
var headX=0;
var particles = [];
var filters= [];
var osc = [];
var isOn = [];
let icon1,icon2,icon3,icon4;
var option = 1;
var vector = [];
var timeSteps = 500;
var thick = 7;
var bHeight;
var tWidth;
var tHeight;
var icon10;
let extracanvas;

function preload() {
    icon1 = loadImage('images/icon1.png');
    icon2 = loadImage('images/icon2.png');
    icon3 = loadImage('images/icon3.png');
    icon4 = loadImage('images/icon4.png');
    icon5 = loadImage('images/pen.png');
    icon6 = loadImage('images/pen.png');
    icon7 = loadImage('images/pen.png');
    icon8 = loadImage('images/pen.png');
    icon9 = loadImage('images/airbrush.png');
    icon10 = loadImage('images/airbrush.png');
    icon11 = loadImage('images/airbrush.png');
    icon12 = loadImage('images/airbrush.png');


}

function setup() {
    var canv = createCanvas(windowWidth, windowHeight);

    background(255,255,255);

    bHeight=height/6;
    tWidth=width/10;
    tHeight=height/10;

    extracanvas = createGraphics(windowWidth-tWidth, windowHeight-bHeight);
    extracanvas.clear();


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
    //if we are in the drawing rectangle, then create an osc
    if(mouseY<=5*height/6 && mouseX<width-tWidth){
        cursorX = mouseX;
        cursorY = mouseY;
        //Create a new particle object and an oscillator epending on the selected brush
        particles.push(new Particle(mouseX, mouseY, thick, option));
        if (option < 7)
             filters.push(new p5.LowPass());
        
        
        else
            filters.push(new p5.HighPass());
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
        else if (option == 5){
            
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(5);
            osc.push(new p5.Noise());
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push([255,0,0]);
        }
        else if (option == 6){
                
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(20);
            osc.push(new p5.Noise('pink'));
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push([180,0,60]);
        }
        else if (option == 7){
            
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(5);
            osc.push(new p5.Noise('brown'));
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push([60,0,180]);
        }
        else if (option == 8){
            
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(30);
            osc.push(new p5.Noise());
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push([0,0,255]);
        }    
        //starts in off mode
        isOn.push(0);
    }
    
    //else if mouse click is in right column
    else if (mouseY<=5*height/6 && mouseX>=width-tWidth){
        //pens
        if (mouseY<tHeight)
            thick = 10;
        else if (mouseY>=tHeight && mouseY<2*tHeight)
            thick = 7;
        else if (mouseY>=2*tHeight && mouseY<3*tHeight)
            thick = 4;
        else if (mouseY>=3*tHeight && mouseY<4*tHeight)
            thick = 2;
        //airbrushes
        else if (mouseY>=4*tHeight && mouseY<5*tHeight)
            thick = 20;
        else if (mouseY>=5*tHeight && mouseY<6*tHeight)
            thick = 17;
        else if (mouseY>=6*tHeight && mouseY<7*tHeight)
            thick = 14;
        else 
            thick = 12;

        //update from pen to airbrush or opposite
        if (thick > 10 && option < 5){
            option += 4;
            
        }
        else if (thick <= 10 && option > 4)
            option -= 4;
       console.log(option);
    }
    //lower bar button update
    else{
        if (mouseX<width/4)
            option = 1;
        else if (mouseX>width/4 && mouseX<width/2)
            option = 2;
        else if (mouseX>width/2 && mouseX<3*width/4)
            option = 3;
        else if (mouseX>3*width/4)
            option = 4;

        if (thick > 10)
            option+=4;


    
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
    
    if (option > 4)
        airbrush();

    

 

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
    if (headX>=width-tWidth)
        headX=0;
    playOscillators();

    for (var i = 0; i < particles.length; i++) {
    if (particles[i].type < 5)
        particles[i].show(lineColor[i]);

  }
  image(extracanvas,0,0);

}



// Daniel Shiffman
// code for https://youtu.be/vqE8DMfOajk

function Particle(x, y, z,option) {
  
    this.x = x;
    this.y = y;
    
    if (z<= 10)
        this.z = z;
    else
        this.z = z - 10;
    
    this.type = option;


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
            if(particles[i].type<=4)
                osc[i].freq(map(particles[i].history[j].y,5*height/6,0,30,600));
            else if (particles[i].type<=6)
                filters[i].freq(map(particles[i].history[j].y,5*height/6,0,10,6000));
            else 
                filters[i].freq(map(particles[i].history[j].y,5*height/6,0,10,6000));
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

    let vOffset = height - bHeight - 8*tHeight;
    translate(0, vOffset);

    fill(130);
    if (thick == 20)
        stroke(255);
    rect(width-tWidth,4*tHeight,tWidth,tHeight);
    icon9.resize(2*tHeight/3,2* tHeight/3);
    image(icon9, width-tWidth/2-icon9.width/2,9*tHeight/2-icon9.height/2);
    noStroke();

    fill(160);
    if (thick == 17)
        stroke(255);
    rect(width-tWidth,5*tHeight,tWidth,tHeight);
    icon10.resize(2*tHeight/3,2* tHeight/3);
    image(icon10, width-tWidth/2-icon10.width/2,11*tHeight/2-icon10.height/2);
    noStroke();

    fill(190);
    if (thick == 14)
        stroke(255);
    rect(width-tWidth,6*tHeight,tWidth,tHeight);
    icon11.resize(tHeight/3,tHeight/3);
    image(icon11, width-tWidth/2-icon11.width/2,13*tHeight/2-icon11.height/2);
    noStroke();

        fill(230);
    if (thick == 12)
        stroke(255);
    rect(width-tWidth,7*tHeight,tWidth,tHeight);
    icon12.resize(tHeight/4,tHeight/4);
    image(icon12, width-tWidth/2-icon12.width/2,15*tHeight/2-icon12.height/2);
    noStroke();

    translate(0, -vOffset);


}

function airbrush() {

    let max = 3* (thick-11);
    let sz = random(5);
    let spread = random(max);
    let r3 = random(cursorX - spread, cursorX + spread);
    let r4 = random(cursorY - spread, cursorY + spread);
    extracanvas.noStroke();

    console.log(option)
    if (option == 5)
        extracanvas.fill(255,0,0);
    if (option == 6)
        extracanvas.fill(180,0,60);
    if (option == 7)
        extracanvas.fill(60,0,180);
    if (option == 8)
        extracanvas.fill(0,0,255);
    extracanvas.ellipse(r3, r4, sz, sz);
}
