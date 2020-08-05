//var socket;
var database;
var sketches;
var newDir;
function setup() {



    	var firebaseConfig = {
	    apiKey: "AIzaSyDkmCULpFe40NfeL6zddWpQB_SR4NmSDvU",
	    authDomain: "sonicdrawdb.firebaseapp.com",
	    databaseURL: "https://sonicdrawdb.firebaseio.com",
	    projectId: "sonicdrawdb",
	    storageBucket: "sonicdrawdb.appspot.com",
	    messagingSenderId: "1035139513533",
	    appId: "1:1035139513533:web:c8aca8da2d1189d540cbd4",
	    measurementId: "G-CBDCBE2KPH"
	  };
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	firebase.analytics();

    
	database = firebase.database();
     
	var ref = database.ref("sketches");
	
        ref.on("value", gotData, errData);


}






/*function submitButton(){


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

        }
    }


    saveJSON(json,ex.json);

    //stringify = JSON.stringify(json);

   
    


}*/



function gotData(data) {
    //console.log(data.val());
    

    var json = {};

    sketches = data.val();
    keys = Object.keys(sketches);

    for (var i = 0; i < keys.length; i++){
        dir = sketches[keys[i]];
        var nm = dir["Name"];
        delete dir["date"];
        delete dir["maxX"];
        delete dir["maxY"];
        delete dir["width"];
        delete dir["height"];
        delete dir["Name"];
        delete dir["Speed"];

        json[nm]={};

        for (var j = 0; j < Object.keys(dir).length; j++){
            console.log(j);
            newDir = {};
            for (var k = 0; k < dir[j].length - 1; k++){
                var a = [0,0];
                a[0]=dir[j]["history"][k+1][0]-dir[j]["history"][k][0];
                a[1]=dir[j]["history"][k+1][1]-dir[j]["history"][k][1];
                newDir[k]=a;
            }
            json[nm][j]=newDir;

        }
   console.log("ok");
        
    }


    saveJSON(json,"dir.json");
    
    

    
}




function errData(err){
    console.log(err);
}



