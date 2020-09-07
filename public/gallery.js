var hg = 0;
var hgp = 0;

function setup() {

canv = createCanvas(windowWidth,windowHeight);
canv.position(0,0);
gallery = select("#List");
load = select("#load");
}



function draw() {
    background(0);
    stroke('rgba(250,100,0,0.5)');

    for (i = 0; i< 40; i++){
var a = random(height/300);
//strokeWeight(random(5));
var hd = $('header').outerHeight();;
line(0,height/40 * i + a ,width, height/40 * i + a);
canv.position(0,hd);
gallery.position(0,hd);
load.position(width/2,windowHeight/2);
canv.style("z-index","1");
gallery.style("z-index","100");
load.style("z-index","200");

hg = $("#List").height();
if (hg != hgp){
    resizeCanvas(windowWidth, $("#List").height(),1);
}
hgp = hg;
}


}


