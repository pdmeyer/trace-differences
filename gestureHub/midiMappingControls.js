inlets = 1;
outlets = 0;
autowatch = 1;

var p = this.patcher;

var numAttr = 0;
var oldNumAttr = 0;

var indexStart = 74; //first controller/osc value in the set of numboxes
//var oscIndex = 9; //if the mode is osc, start at this index
var midiIndex = 74; //if the mode is midi, start CC numbers at this number

//setting the mode
// var mode = "OSC"; // initial
// if(jsarguments.length > 1) //allow mode to be set with argument
// 	mode = jsarguments[1];

// define maxobj variables
var theNumboxes = new Array(128);
var theComments = new Array(128);
var theTrig = p.getnamed("thetrig");
var theJoin;

// function loadbang() {
// 	if(mode == "MIDI") { //on load, check the mode and set the numbox indexing accordingly
indexStart = midiIndex;
// 		outlet(0, 2)
// 	} else {
// 		indexStart = oscIndex //if the mode is OSC, take oscIndex (will be set via setprop)
// 		outlet(0, 1)
// 	}
// };

// function bang() {
	
// 	loadbang()
// };

function clear() { 
	for (i = 0; i < oldNumAttr; i++) {
		p.remove(theNumboxes[i]);
		p.remove(theComments[i])
	}
	p.remove(theJoin)
};

function attr() {
	attArr = arrayfromargs(arguments);
	numAttr = attArr.length;
	// loadbang();

	if(numAttr) { //check that there are attributes
		//remove ya
		if (oldNumAttr) {
			clear();
		}
		//add ya
		theJoin = p.newdefault(375.5, 459., "join", numAttr, "@triggers", -1);
		p.connect(theJoin, 0, theTrig, 0);

		for (j = 0; j < numAttr; j++) {

			var presTop = 52. + (24 * j);
			var patchLeft = 375.5 + (j * 52.);

			theNumboxes[j] = p.newdefault(patchLeft, 373., "number", "@triangle", 0, "@minimum", 1, "@maximum", 128, "@presentation", 1, "@presentation_rect", 10., presTop, 30., 20.);
			theComments[j] = p.newdefault(patchLeft, 350., "comment", "@presentation", 1, "@presentation_rect", 40., presTop, 80., 20.);

			//connect stuff
			p.connect(theNumboxes[j], 0, theJoin, j);

			//populate
			theComments[j].set(attArr[j]);
			theNumboxes[j].message(j + indexStart)
		};

		oldNumAttr = numAttr

	} else {
		post("you gotta append a bunch of attribute names to that attr message for this thing to like... do anything \n")
	}
};

function setmode(modeType) {
	mode = modeType;
	if (mode != "MIDI"); {
		if(oldNumAttr) {
			clear();
		}
	}

};

function renumber() {
	for (m = 0; m < numAttr; m++) { 
		theNumboxes[m].message(m + indexStart)
	}
	
}

