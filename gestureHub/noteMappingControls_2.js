inlets = 1;
outlets = 1;
autowatch = 1;

var p = this.patcher;

var attArr = [];
var oldAttArr = [];
var oldNumAttr = oldAttArr.length;
// var numAttr = attArr.length;
// var oldNumAttr = oldAttArr.length;

// define maxobj variables
var theColl = p.getnamed("notemappingcoll")
var theMenus = new Array(32);
var theComments = new Array(32);
var theMessages = new Array(32);
var theJoin;
var thePattr = p.getnamed("noteAssignments");
var theSpray;
var theLf = p.getnamed("notemaplf")

var menuMsgs = ["--", "trig", "pitch", "vel", "dur"];

//removes existing stuff
function clear() { 
	for (i = 0; i < oldNumAttr; i++) {
		p.remove(theMenus[i]);
		p.remove(theComments[i]);
		p.remove(theMessages[i])
	}
	p.remove(theSpray);
	p.remove(theJoin);
	oldAttArr = []
};


function attr() {
	attArr = arrayfromargs(arguments);
	numAttr = attArr.length;
	if(numAttr) { // did the message supply arguments? (if not, show a warning)
		if(oldNumAttr) { // are there already boxes in place from before?
			if(attArr.toString() === oldAttArr.toString()) { // if there are already boxes, are they they same ones?
			} else { // otherwise, clear everything and start fresh
				clear();
				add.apply(null, arguments)
			}
		} else { // if there weren't boxes in place, add them
			add.apply(null, arguments)
		}
		//refill the coll 
		outlet(0, "clear");
		for(k = 0; k < numAttr; k++) {
			outlet(0, k, attArr[k], 0); // for coll. index num, attribute name, umenu selection id (defaulted to 0)
		}
	} else {
		post("you need to append a bunch of attribute names to that attr message \n")
	};
	oldAttArr = attArr;
	oldNumAttr = oldAttArr.length;
};


function add() {
	var attArr = arrayfromargs(arguments);
	theJoin = p.newdefault(258., 418., "join", numAttr, "@triggers", -1);
	theSpray = p.newdefault(362., 208., "spray", numAttr, 0, 1);
	for (j = 0; j < numAttr; j++) {

		var presTop = 52. + (24 * j);
		var patchLeft = 362.+ (j * 102.);

		theComments[j] = p.newdefault(patchLeft, 250., "comment", "@presentation", 1, "@presentation_rect", 57., presTop, 80., 20., "@textjustification", "right");
		theMenus[j] = p.newdefault(patchLeft, 273., "umenu", "@presentation", 1, "@presentation_rect", 4., presTop, 50., 22.);
		theMessages[j] = p.newdefault(patchLeft, 300., "message");

		//populate
		theComments[j].set(attArr[j]);
		theMessages[j].set(["nsub", j, 2, "$1"]);
		for (l = 0; l < menuMsgs.length; l++) {
			theMenus[j].message(["append", menuMsgs[l]])
		}

		//connect
		p.connect(theMenus[j], 0, theMessages[j], 0);
		p.connect(theMenus[j], 0, theJoin, j);
		p.connect(theSpray, j, theMenus[j], 0);
		p.connect(theMessages[j], 0, theColl, 0)
	}
	p.connect(theJoin, 0, thePattr, 0);
	p.connect(theLf, 0, theSpray, 0);
}
