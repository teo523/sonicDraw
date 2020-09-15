var socket;
var lineThickness;
var lineColor = [];
var cursorX;
var cursorY;
var headX=0;
var speed = 10;
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
var isPlaying = 0;
let vOffset;
var email;
var picker;
var border = 90;
var canv;
var started = 1;
var begin = 1;
var sendMsgBool = 0;
var a= 0;
var database;
var storage;
var saveCnv = 0;
var author = "unknown";
var drawFile;
var ex;
var nm;
var keys;
var nn = 23; 
var colors = [[255,255,0],[255,0,255],[0, 255, 255],[300,300,300]];

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
    icon13 = loadImage('images/play.png');
    icon14 = loadImage('images/stop.png');
    icon15 = loadImage('images/save.png');
    icon16 = loadImage('images/mail.png');


}

function setup() {
    var canv = createCanvas(windowWidth, windowHeight);
    background(0,20,0);



    

    socket = io.connect();

    lineThickness = 1;
    var data = {
        thickness: lineThickness,
        color: lineColor
    };
    

    socket.on('trace', addParticle);

    loader = select("#load");
    loader.style("width",JSON.stringify(floor(width/3)));
    loader.position((width-loader.width)/2,(height-loader.height)/2);
    loader.hide();
    loader.style("background-color","grey");


    backB = select("#back");
    //backB.style("width", JSON.stringify(width-4*bWidth));
    backB.position(0,0);
   

    sendMsg = select("#sendMsg");
    sendMsg.hide();

    sendBtn = select("#sendBtn");
    sendBtn.mousePressed(hideSendMessage);

    sendCancelBtn = select("#sendCancelBtn");
    sendCancelBtn.mouseClicked(cancelSendMessage);

    vOffset = (height - bHeight - 8*tHeight)/2;
    bHeight=height/6;
    tWidth=width/10;
    tHeight=height/10;
    bWidth= (width - tWidth - 6 * vOffset)/4;

    extracanvas = createGraphics(windowWidth, windowHeight);
    extracanvas.clear();

    //messageCanvas = createGraphics(windowWidth-2*border, windowHeight-2*border);
    

    slider = createSlider(1, 50, 10);
    slider.position(4*bWidth+3*vOffset ,height-0.8* bHeight / 3);
    slider.style("width", "8vw");
     slider.style("background", "red");
     

    //Firebase
    var firebaseConfig = {
    apiKey: "AIzaSyB3sRkBJQM5FNdqa9PaZvrI6n_-fPxR7ak",
    authDomain: "sonicdraw-tr.firebaseapp.com",
    databaseURL: "https://sonicdraw-tr.firebaseio.com",
    projectId: "sonicdraw-tr",
    storageBucket: "sonicdraw-tr.appspot.com",
    messagingSenderId: "664295741160",
    appId: "1:664295741160:web:cfb432a79e39898e789b5d",
    measurementId: "G-K8WZJ83DER"
  };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    
    database = firebase.database();
     
    var ref = database.ref("sketches");
    // if (localStorage.selDrawing!=undefined){
    //     loader.show();
    //     ref.on("value", gotData, errData);
    // }    
    
}

function hideSendMessage() {
    
    inp = select("#name");
    if (inp.value()==""){
        alert("Please write a name or a nickname")
    }
    else {
    sendMsg.hide();
    author = inp.value();
    saveCnv = 1;
   
    submitButton();}
}

function cancelSendMessage() {
    
    sendMsg.hide();
    sendMsgBool = 0;
    started = 1;

}

function startAll() {
    started = 1 - started;
    window.scrollTo(0, 0);
}



function mousePressed() {
      if (started){
    

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
            lineColor.push(colors[0]);
        }
        else if (option == 2){
            osc.push(new p5.Oscillator('sawtooth'));
            lineColor.push(colors[1]);
        }
        else if (option == 3){
            osc.push(new p5.Oscillator('triangle'));
            lineColor.push(colors[2]);
        }
        else if (option == 4){
            osc.push(new p5.Oscillator('square'));
            lineColor.push(colors[3]);
        }
        else if (option == 5){
            
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(5);
            osc.push(new p5.Noise());
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push(colors[0]);
        }
        else if (option == 6){
                
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(20);
            osc.push(new p5.Noise('pink'));
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push(colors[1]);
        }
        else if (option == 7){
            
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(5);
            osc.push(new p5.Noise('brown'));
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push(colors[1]);
        }
        else if (option == 8){
            
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(30);
            osc.push(new p5.Noise());
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push(colors[0]);
        }    
        //starts in off mode
        isOn.push(0);
    }
    
    //else if mouse click is in right column
    else if (mouseY<=5*height/6 && mouseX>=width-tWidth && mouseX<width){
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
        else if (mouseY>=4*tHeight + vOffset && mouseY<5*tHeight + vOffset)
            thick = 20;
        else if (mouseY>=5*tHeight + vOffset && mouseY<6*tHeight + vOffset)
            thick = 17;
        else if (mouseY>=6*tHeight + vOffset && mouseY<7*tHeight + vOffset)
            thick = 14;
        else if (mouseY>=7*tHeight + vOffset && mouseY<8*tHeight + vOffset)
            thick = 12;

        
    
    }
    //lower bar button update
    else {
        if (mouseX<bWidth)
            option = 1;
        else if (mouseX>bWidth && mouseX<2*bWidth)
            option = 2;
        else if (mouseX>2*bWidth && mouseX<3*bWidth)
            option = 3;
        else if (mouseX>3*bWidth && mouseX<4*bWidth)
            option = 4;
        else if (mouseY > height - bHeight + vOffset/2 && mouseY < height - bHeight + vOffset/2 + 2*bHeight/3 - vOffset && mouseX > 4 * bWidth + vOffset && mouseX < 4 * bWidth + vOffset + (width - (4 * bWidth + vOffset))/2) 
            isPlaying = 1 - isPlaying;
        else if (mouseY > height - bHeight + vOffset/2 && mouseY < height - bHeight + vOffset/2 + 2*bHeight/3 - vOffset &&  mouseX > 4 * bWidth + vOffset + (width - (4 * bWidth + vOffset))/2 && mouseX < width) 
                {
                    started = 0;
                    sendMsgBool = 1;
                    isPlaying = 0;
                   
                    sendMsg.style("width",JSON.stringify(floor(width/3)));
                    
                    //console.log(JSON.stringify(width/3));
                    sendMsg.position(width/2-sendMsg.width/2,height/2-sendMsg.height/2);
                    sendMsg.show();
                    

                    //submitButton();

        }
      
//rect(4 * bWidth + vOffset, height - bHeight + vOffset/2,(width - (4 * bWidth + vOffset))/2,2*bHeight/3 - vOffset);

    
    }

//update from pen to airbrush or opposite
        if (thick > 10 && option < 5){
            option += 4;
            
        }
        else if (thick <= 10 && option > 4){
            option -= 4;

        }
    }
}


function mouseDragged() {

   if (started){
   
    if (mouseY<=5*height/6 && mouseX<=width-tWidth){
    var mousex = mouseX;
    var mousey = mouseY;
    cursorX = 0.93*cursorX+0.07*mousex;
    cursorY = 0.93*cursorY+0.07*mousey;
    var data = {
        x: cursorX,
        y: cursorY,
    };
    //socket.emit('mouse', data);
    if(particles.length>0)
        particles[particles.length-1].update();
    
    if (option > 4)
        airbrush();

    
}
 


}



}

function draw() {
   background(0,20,0);
    //a= a + frameRate();
    //if (random() < 0.1)
    //console.log("frameRate: " + frameRate() + " , average: " + a/frameCount);
    

    if (!started && !begin && !sendMsgBool){
        text2.hide();
        slider.hide();
        resizeCanvas(0.6*windowWidth, windowHeight,1);
        extracanvas.size(0.6*windowWidth, windowHeight,1);
        begin = 1;
        isPlaying=0;
    }
   
    
    //canv.hide();
    
   

    
    slider.position(4*bWidth+3*vOffset ,height-0.8* bHeight / 3);
    backB.position(4 * bWidth ,8*tHeight);
    backB.style("height",JSON.stringify(floor(height - bHeight + vOffset/2-8*tHeight - 5)));
    backB.style("width", JSON.stringify(floor(width-4*bWidth)));
    

    //start.position(width/2,5*height/6);
    //showInitMessage()
    //showParagraph();
//(width - (4 * bWidth + vOffset))/2,2*bHeight/3 - vOffset)
    speed = slider.value();

    if (mouseIsPressed && mouseY<=5*height/6 && mouseX<=width-tWidth && started) {
        mouseDragged();

    }

    menuButtons();
    stroke(300,300,300);
    line(headX,0,headX,height-bHeight);
    if (isPlaying){
        headX+=speed;
        masterVolume(1);
    }
    else
         masterVolume(0);

    if (headX>=width-tWidth)
        headX=0;
    playOscillators();

    for (var i = 0; i < particles.length; i++) {
    if (particles[i].type < 5)
        particles[i].show(lineColor[i]);

  }
  image(extracanvas,0,0);
  //image(messageCanvas,border,border);
 if (saveCnv){
    //saveCanvas(author,"png");
    saveCnv = 0;
 }

}

/*function changeSlider() {
    lineThickness = parseInt(document.getElementById("thickness").value);
    lineColor = [
        parseInt(document.getElementById("r").value), 
        parseInt(document.getElementById("g").value), 
        parseInt(document.getElementById("b").value)
    ];

    var data = {
        thickness: lineThickness,
        color: lineColor
    };
    socket.emit('changeSlider', data);
}
*/

function mouseReleased() {

    var json = {};
    json["width"]=width;
    json["height"]=height;
    json["maxX"]=width - tWidth;
    json["maxY"]=height - bHeight;
        
        json.type=particles[particles.length - 1].type;
        json.history=[];
        for (var j = 0; j < particles[particles.length - 1].history.length; j++){
            json.history[j]=[];
            json.history[j][0]= particles[particles.length - 1].history[j].x;
            json.history[j][1]= particles[particles.length - 1].history[j].y;
            json.history[j][2]= particles[particles.length - 1].history[j].z;

        }
    console.log("emit");

    socket.emit('trace', json);


}

function addParticle(trace) {
    console.log("addParticle");
    var mX = trace["maxX"];
    var mY = trace["maxX"];
    var wd = trace["width"];
    var ht = trace["height"];
 
     if (trace.history != undefined){
        //console.log(trace.history);
       
       //Create a new particle object and an oscillator epending on the selected brush
        particles.push(new Particle(trace.history[0][0]*width/wd, trace.history[0][1]*height*ht,  trace.history[0][2] + 10, trace.type));
        trace.type;



        
        if (trace.type < 7)
             filters.push(new p5.LowPass());
        
        
        else
            filters.push(new p5.HighPass());
        if (trace.type == 1){
            osc.push(new p5.Oscillator('sine'));
            lineColor.push(colors[0]);
        }
        else if (trace.type == 2){
            osc.push(new p5.Oscillator('sawtooth'));
            lineColor.push(colors[1]);
        }
        else if (trace.type == 3){
            osc.push(new p5.Oscillator('triangle'));
            lineColor.push(colors[2]);
        }
        else if (trace.type == 4){
            osc.push(new p5.Oscillator('square'));
            lineColor.push(colors[3]);
        }
        else if (trace.type == 5){
            
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(5);
            osc.push(new p5.Noise());
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push(colors[0]);
        }
        else if (trace.type == 6){
                
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(20);
            osc.push(new p5.Noise('pink'));
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push(colors[1]);
        }
        else if (trace.type == 7){
            
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(5);
            osc.push(new p5.Noise('brown'));
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push(colors[2]);
        }
        else if (trace.type == 8){
            
            filters[filters.length-1].freq(100);
            filters[filters.length-1].res(30);
            osc.push(new p5.Noise());
            osc[osc.length-1].disconnect();
            osc[osc.length-1].connect(filters[filters.length-1]);
            lineColor.push(colors[3]);
        }    
        //starts in off mode
        isOn.push(0); 
        for (var j=0;j<trace.history.length;j++) {
        var v = createVector(trace.history[j][0]*width/wd, trace.history[j][1]*height/ht, trace.history[j][2]);
        if (trace.type > 4) {
               let max = 3* (20-11);
            let sz = random(5);
            let spread = random(max);
            let r3 = random(trace.history[j][0]*width/wd - spread, trace.history[j][0]*width/wd + spread);
            let r4 = random(trace.history[j][1]*height/ht - spread, trace.history[j][1]*height/ht + spread);
            extracanvas.noStroke();
  
     
            if (trace.type == 5)
                extracanvas.fill(255,0,0);
            if (trace.type == 6)
                extracanvas.fill(180,0,60);
            if (trace.type == 7)
                extracanvas.fill(60,0,180);
            if (trace.type == 8)
                extracanvas.fill(0,0,255);
            extracanvas.ellipse(r3, r4, sz, sz);
            }
        particles[particles.length-1].history.push(v);  
}
    }
}

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
      //console.log(osc[i].getAmp());
var Playing = 0;
    for (var j=0;j<particles[i].history.length;j++) {
        if (abs(particles[i].history[j].x-headX)< 5){
            Playing = 1;
            let x = 5 - particles[i].history[j].y/(height/6);
            let f = 50*pow(2,x);
            if(particles[i].type<=4)
                osc[i].freq(f);
                
            else if (particles[i].type<=6)
                filters[i].freq(f);
            else 
                filters[i].freq(f);

            osc[i].amp(map(particles[i].history[j].z,1,10,0.01,0.2),0.01);
          
           if (isOn[i] == 0){
            
            osc[i].start();  
            isOn[i]=1;}
            break;
        }
    
    }
if (isOn[i]==1 && Playing==0){
    osc[i].amp(0,0.01);
    isOn[i] = 0;
    //osc[i].stop(0.02);
}
//if (osc[i].amp().value>0)
//console.log(osc[i].amp().value);

}
}

function menuButtons() {
    bHeight=height/6;
    tWidth=width/10;
    tHeight=height/10;
    bWidth= (width - tWidth - 6 * vOffset)/4;
    noStroke();
    strokeWeight(4);
    
    //paint bottom bar rectangles with white frame if they are selected
    fill(colors[0]);
    if (option == 1 || option == 5)
        stroke(255);

    rect(0,height - bHeight,bWidth,bHeight);
    icon1.resize(bHeight/2,bHeight/2);
    image(icon1, bWidth/2-icon1.width/2,height-bHeight/2-icon1.height/2);
    noStroke();

    if (option == 2 || option == 6)
        stroke(255);
    fill(colors[1]);
    rect(bWidth,height - bHeight,bWidth,bHeight);
    icon2.resize(bHeight/2,bHeight/2);
    image(icon2, 3*bWidth/2-icon2.width/2,height-bHeight/2-icon1.height/2);
    noStroke();

    if (option == 3 || option == 7) 
        stroke(255);
    fill(colors[2]);
    rect(2*bWidth,height - bHeight,bWidth,bHeight);
    icon3.resize(bHeight/2,bHeight/2);
    image(icon3, 5*bWidth/2-icon1.width/2,height-bHeight/2-icon1.height/2);
    noStroke();

    if (option == 4 || option == 8)
        stroke(255);
    fill(colors[3]);
    rect(3*bWidth,height - bHeight,bWidth,bHeight);
    icon4.resize(bHeight/2,bHeight/2);
    image(icon4, 7*bWidth/2-icon1.width/2,height-bHeight/2-icon1.height/2);
    noStroke();

    //paint right vertical bar rectangles with white frame if they are selected
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

    vOffset = (height - bHeight - 8*tHeight)/10;
    translate(0, vOffset);

    //airbrushes rectangles
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
    

    //draw slider background and play button
    fill(190);
    rect(4 * bWidth, height - bHeight,width - 4 * bWidth ,bHeight);

    fill(0);
    rect(4 * bWidth + vOffset, height - bHeight/3,width - (4 * bWidth + vOffset),bHeight/3);
    if (isPlaying)
        fill(255,0,0);
    else 
        fill(0,255,0);

    rect(4 * bWidth + vOffset, height - bHeight + vOffset/2,(width - (4 * bWidth + vOffset))/2,2*bHeight/3 - vOffset);

    if (isPlaying) {  
        icon14.resize(tHeight/2,tHeight/2);
        image(icon14, 4*bWidth + vOffset+(width - (4 * bWidth + vOffset))/4-icon14.width/2,height - bHeight + icon14.height/2);
    }
    else {
        icon13.resize(tHeight/2,tHeight/2);
        image(icon13, 4*bWidth + vOffset+(width - (4 * bWidth + vOffset))/4-icon13.width/2, height - bHeight + icon13.height/2);
    }

   /* SAVE ICON 
    icon15.resize(width/30,width/30);
    image(icon15, 0,0);*/
    
    //SEND
    fill(255);
    rect(4 * bWidth + vOffset + (width - (4 * bWidth + vOffset))/2, height - bHeight + vOffset/2,(width - (4 * bWidth + vOffset))/2,2*bHeight/3 - vOffset);
    icon16.resize(0.7*tHeight,0.7*tHeight);
    image(icon16, 4 * bWidth + vOffset + (width - (4 * bWidth + vOffset))/2 + icon16.width/3, height - bHeight + vOffset/2 + icon16.height/6);


}

function airbrush() {

    let max = 3* (thick-11);
    let sz = random(5);
    let spread = random(max);
    let r3 = random(cursorX - spread, cursorX + spread);
    let r4 = random(cursorY - spread, cursorY + spread);
    extracanvas.noStroke();
  
     
    if (option == 5)
        extracanvas.fill(colors[0]);
    if (option == 6)
        extracanvas.fill(colors[1]);
    if (option == 7)
        extracanvas.fill(colors[2]);
    if (option == 8)
        extracanvas.fill(colors[3]);
    extracanvas.ellipse(r3, r4, sz, sz);
}



function submitButton(){


    inp = select("#name");


    var json = {};
    
    json["Name"]=inp.value();
    json["Speed"]=speed;
    json["date"]=year()+"-" + month()+"-"+day()+" - "+hour()+":"+minute()+":"+second();
    json["width"]=width;
    json["height"]=height;
    json["maxX"]=width - tWidth;
    json["maxY"]=height - bHeight;

    for (var i = 0; i < particles.length; i++){
        json[i]={};
        json[i].type=particles[i].type;
        json[i].history=[];
        for (var j = 0; j < particles[i].history.length; j++){
            json[i].history[j]=[];
            json[i].history[j][0]= particles[i].history[j].x;
            json[i].history[j][1]= particles[i].history[j].y;
            json[i].history[j][2]= particles[i].history[j].z;

        }
    }
    stringify = JSON.stringify(json);

    var ref = database.ref("sketches");
   
    ref.push(json);

    ref.on("value", sendCanvas, errData);

    
    


}



function errData(err){
    console.log(err);
}


function sendCanvas(data){

var sketches = data.val();
keys = Object.keys(sketches);
var id = keys[keys.length - 1];
console.log("id: " + id);

var storageRef = firebase.storage().ref();
var childRef = storageRef.child(id + '.jpg');

var canvas0 = document.getElementById('defaultCanvas0');

canvas0.toBlob(function(blob) {
       // use the Blob or File API
childRef.put(blob).then(function(snapshot) {
  console.log('Uploaded a blob or file!');
});

});

alert("Thank you! your piece was submitted successfully! You can check it out in the gallery!")


}
