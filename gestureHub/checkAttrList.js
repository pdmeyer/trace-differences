inlets = 1; 
outlets = 0; 

var storedAttrs = new Array(128);
var newAttrs = new Array(128);
var numStoredAttrs = storedAttrs.length;

function check(){
	if(numStoredAttrs) {
		newAttrs = arrayfromargs(arguments);
		if(newAttrs.toString() != storedAttrs.toString()) {
			post("WARNING: Inbound attributes do not match patch attributes \n")
		}	
	}
	
}