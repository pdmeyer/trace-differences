inlets = 1;
outlets = 1;

function addBreaks() {
	var a = arrayfromargs(arguments);
	var b = a.toString();
	var c = b.replace(/,/g, "\n");
	outlet(0,c)
}