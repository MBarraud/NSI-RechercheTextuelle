var T = "CAATGTCTGCACCATGACGCCGGCATCTGCGAAGGCAGGAGCATGACCATGATTTCGAACCTACTAGTGGGTCTCTTAGGCCGAGCGGTTCCGAGAGATAGTGAAAGATGGCTGGGCTGTGAAGGGAAGGAGTCGTGAAAGCGCGAACACGAGTGTGCGCAAGCGCAGCGCCTTAGTATGCTCCAGTGTAGAAGCTCCGGCGTCCCGTCTAACCGTACGCTGTCCCCGGTACATGGAGCTAATAGGCTTTACTGCCCAATATGACCCCGCGCCGCG";
var M = "CAGGAG";
var carteT = [];
var carteM = [];
var suit = false;
var dx = 5;
var dy = 5;
var nb = 30

document.documentElement.style.setProperty('--nbCarte', ''+nb);
document.querySelector('#texte').style.setProperty('height', 'calc(calc(100vh - 50px) - 4em)');
document.querySelector('#texte').style.setProperty('overflow','hidden');
document.querySelector('#motif').style.setProperty('position','absolute');
document.querySelector('#motif').style.setProperty('left','0');
document.querySelector('#motif').style.setProperty('top','0');
document.querySelector('#motif').style.setProperty('width','calc(calc(calc(var(--largeurCarte) + 12px)* '+M.length+') + 1px)');
document.querySelector('#motif').style.setProperty('transition','opacity 2s ease');
init(T,M);
function suivre(evenement) {
    if(navigator.appName=="Microsoft Internet Explorer") {
        var x = evenement.x+document.body.scrollLeft;
        var y = evenement.y+document.body.scrollTop;
    } else {
        var x =  evenement.pageX;
        var y =  evenement.pageY;
    }
    document.getElementById("motif").style.left = (x-dx)+'px';
    document.getElementById("motif").style.top  = (y-dy)+'px';
}

function attrape(evenement){
    evenement.target.style.setProperty('cursor','grabbing');
    if(navigator.appName=="Microsoft Internet Explorer") {
        var x = evenement.x+document.body.scrollLeft;
        var y = evenement.y+document.body.scrollTop;
    } else {
        var x =  evenement.pageX;
        var y =  evenement.pageY;
    }
    console.log(document.getElementById("motif").style.left);
    dx = x - parseInt(document.getElementById("motif").style.left.slice(0,-2),10);
    dy = y - parseInt(document.getElementById("motif").style.top.slice(0,-2),10);
    document.addEventListener("mousemove", suivre, false);
    document.getElementById("motif").style.setProperty('filter','alpha(opacity=50)');
    document.getElementById("motif").style.setProperty('opacity','0.5');
}

function lache(evenement){
    evenement.target.style.setProperty('cursor','grab');
    document.removeEventListener("mousemove", suivre, false);
    document.getElementById("motif").style.setProperty('filter','');
    document.getElementById("motif").style.setProperty('opacity','');
}

function init(t,m) {
    carteT = [];
    var texte = document.querySelector('#texte');
    texte.textContent="";
    for (k=0;k<t.length;k++) {
        carte = document.createElement("div");
        carte.classList.add("carte");
        carte.textContent=t[k];
        carteT.push(carte);
        texte.appendChild(carte);
    }
    carteM = [];
    var motif = document.querySelector('#motif');
    motif.textContent="";
    for (k=0;k<m.length;k=k+1) {
        carte = document.createElement("div");
        carte.classList.add("carte");
        carte.textContent=m[k];
        carte.classList.add('fondOK');
        carte.style.setProperty('cursor','grab');
        carte.addEventListener('mousedown',attrape,false);
        carte.addEventListener('mouseup',lache,false);
        carteM.push(carte);
        motif.appendChild(carte);
    }
    document.getElementById("motif").style.left = ((window.innerWidth-document.getElementById("motif").clientWidth)/2)+'px';
    document.getElementById("motif").style.top  = (window.innerHeight/3-document.getElementById("motif").clientHeight/2)+'px';
}

function handle(delta) {
	nb = nb + delta;
	document.documentElement.style.setProperty('--nbCarte', ''+nb);
}

function wheel(event){
	var delta = 0;
	if (!event) event = window.event;
	if (event.wheelDelta) {
		delta = event.wheelDelta/120; 
	} else if (event.detail) {
		delta = -event.detail/3;
	}
	if (delta)
		handle(delta);
        if (event.preventDefault)
                event.preventDefault();
        event.returnValue = false;
}

/* Initialization code. */
if (window.addEventListener)
	window.addEventListener('DOMMouseScroll', wheel, false);
window.onmousewheel = document.onmousewheel = wheel;