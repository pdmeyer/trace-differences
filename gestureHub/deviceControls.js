inlets = 1;
outlets = 1;

// global variables and arrays
var numDials = 0;
var thevalues = new Array(128);
var p = this.patcher;

// Maxobj variables for scripting
var theDials = new Array(128);
var theJoin;
var theSpray;
var thePattr = p.getnamed("deviceVals");
var theLf = p.getnamed("pattrlf");
var randomize = p.getnamed("randomize");
var msgPrefix = "wekinator/control/setOutputNames";
var wekSetMsg = p.getnamed("wekSetMsg");
var oldNumDials = 0;


function clear() {
	if(oldNumDials) {
			p.remove(theSpray);
			p.remove(theJoin);
			}
		for(i = 0;i <= oldNumDials; i++) // get rid of the ctlin and udial objects using the old number of dials
		{
			p.remove(theDials[i]);
		}
}

// dials -- generates and binds the dials in the max patch
function dials(val)
{

	if(arguments.length) // bail if no arguments
	{
		// parse arguments
		var a = arguments[0];

		// safety check for number of dials
		if(a<0) a = 0; // too few dials, set to 0
		if(a>128) a = 128; // too many dials, set to 128

		// out with the old...
		clear();

		// ...in with the new
		numDials = a - 1; // update our global number of dials to the new value
		if(numDials) {
			theJoin = p.newdefault(63, 312, "join", a , "@triggers", -1);
			theSpray = p.newdefault(318, 205, "spray", a, 1, 1)
		};
		for(k = 0; k < a; k++) // create the new udial objects, connect them all the things
		{
			theDials[k] = p.newdefault(63 + (k * 43), 248, "dial", "@min", 0., "@size", 1., 
				"@floatoutput", 1, "@presentation", 1, "@presentation_rect", 8. + ((k % 4) * 42),  Math.ceil((k+1) / 4) * 42., 40., 40.);
			p.connect(theDials[k],0, theJoin, k);
			p.connect(theSpray, k, theDials[k], 0)
		}
		
		if (numDials) {
			// connect more things
			p.connect(theJoin, 0, thePattr,0);
			p.connect(randomize, 0, theSpray, 0);
			p.connect(wekSetMsg, 0, theSpray, 0);
			p.connect(theLf, 0, theSpray, 0);
			
			//tell wekinator about these outputs
			var msgArr = [];
			for(l = 0; l < a; l++) {
				msgArr.push(l + 1)
			};
			outlet(0, msgPrefix, msgArr)
			oldNumDials = numDials;
		}
	}

	else // complain about arguments
	{
		post("dials message needs arguments");
		post();
	}
}

