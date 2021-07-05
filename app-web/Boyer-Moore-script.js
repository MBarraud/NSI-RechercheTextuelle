// 
// Mickaël BARRAUD 
// mickael.barraud@ac-nantes.fr
// CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// Écrit dans l'optique d'enseigner la recherche textuelle en TNSI
// Mise à jour de Juillet 2021
// https://github.com/MBarraud/NSI/tree/master/rechercheTextuelle
// 
var alphabet = "ACGT";
var T = "CATCTGCGAAGGCAGGAGCATGACC";
var M = "CAGGAG";

var carteT = [];           // Liste des lettres du texte
var carteM = [];           // Liste des lettres du motif
var positionM = 0;         // Position (indice i) du motif
var reverse = false;       // La recherche se fait-elle vesr la gauche ?
var autotest = false;      // Le test est-t-il automatique ?
var indice = false;        // Les jetons sont-ils visibles ?
var testencours = null;    // Identifiant de l'annimation en cours
var mauvaisCaractere = {}; // Dictoinnaires des mauvais caractères
var bonSuffixe = [];       // Tableau des bon suffixes

init(T,M);

////////////////////////////////////////////////////////////////
// Mise en place des gestionnaires d'événement.
////////////////////////////////////////////////////////////////
// Clique sur la flèche +1
document.querySelector('#p1').addEventListener('click',evt => {avance(1)});
// Clique sur la flèche -1
document.querySelector('#m1').addEventListener('click',evt => {avance(-1)});
// Clique sur le rond centrale de retour
document.querySelector('#init').addEventListener('click',evt => {avance(-positionM)});
// Clique sur le switch auto/manuel
document.querySelector('#auto').addEventListener('click',evt => {
    autotest=!autotest;
    if (autotest) {
        evt.target.textContent="Tests automatiques";
        if (indice) {
            document.querySelector('.indicei').classList.remove("invisible");
            document.querySelector('.indicej').classList.remove("invisible");
        }
        document.querySelector('#indice').classList.remove("invisible");
        document.querySelector('#reverse').classList.remove("invisible");
        document.querySelector('#checkmc').classList.remove("invisible");
        document.querySelector('#checkbs').classList.remove("invisible");
        if (document.querySelector('#checkmc').checked) document.querySelector('#mc').classList.remove("invisible");
        if (document.querySelector('#checkbs').checked) document.querySelector('#bs').classList.remove("invisible");
    }
    else {
        evt.target.textContent="Tests manuels";
        document.querySelector('#indice').classList.add("invisible");
        document.querySelector('#reverse').classList.add("invisible");
        document.querySelector('.indicei').classList.add("invisible");
        document.querySelector('.indicej').classList.add("invisible");
        document.querySelector('#mc').classList.add("invisible");
        document.querySelector('#checkmc').classList.add("invisible");
        document.querySelector('#bs').classList.add("invisible");
        document.querySelector('#checkbs').classList.add("invisible");
    }
    avance(0);});
// Clique sur le switch indice ON/OFF
document.querySelector('#indice').addEventListener('click',evt => {
    indice=!indice;
    if (indice) {
        evt.target.textContent="Indice ON";
        document.querySelector('.indicei').classList.remove("invisible");
        document.querySelector('.indicej').classList.remove("invisible");
    }
    else {
        evt.target.textContent="Indice OFF";
        document.querySelector('.indicei').classList.add("invisible");
        document.querySelector('.indicej').classList.add("invisible");
    }
    });
// Clique sur le switch de recherche gauche/droite
document.querySelector('#reverse').addEventListener('click',evt => {
    reverse=!reverse;
    avance(0);
    if (reverse) evt.target.innerHTML="&larr;";
    else {
        evt.target.innerHTML="&rarr;";
        // Décoche les check bs et mc et leur envois l'event de changement
        if (document.querySelector('#checkmc').checked) {
            document.querySelector('#checkmc').checked = false;
            document.querySelector('#checkmc').dispatchEvent(new Event('change'));
        }if (document.querySelector('#checkbs').checked) {
            document.querySelector('#checkbs').checked = false;
            document.querySelector('#checkbs').dispatchEvent(new Event('change'));
        }
    }
    });
// Gestionnaire lié au changement coché/décoché des chek bs et mc
function clickCheck(evt) {
    if (evt.target.checked) {
        document.querySelector('#'+evt.target.name).classList.remove("invisible");
        reverse = true;
        document.querySelector('#reverse').innerHTML="&larr;";
        avance(0);
    }
    else document.querySelector('#'+evt.target.name).classList.add("invisible");
}
// Changement de coché/décoché des chek bs et mc
document.querySelector('#checkmc').addEventListener('change',clickCheck, false);
document.querySelector('#checkbs').addEventListener('change',clickCheck, false);
// Ouverture du menu par la touche Échap
document.onkeydown = evt => {if (evt.keyCode==27) menu()};
// Ouverture du menu par le click sur la roue
document.querySelector('#outils').addEventListener('click',menu,false);

////////////////////////////////////////////////////////////////
// Menu
////////////////////////////////////////////////////////////////
function menu(){
	document.querySelector("main").style.filter="blur(5px)";
    document.querySelector("#menu").style.display="inline-block";
    document.querySelector("#texteval").value=T;
    document.querySelector("#motifval").value=M;
    document.querySelector("#alphabet").value=alphabet;
}
function annule() {
    document.querySelector("main").style.filter="";
    document.querySelector("#menu").style.display="none";
}
function valide() {
    document.querySelector("main").style.filter="";
    document.querySelector("#menu").style.display="none";
    T = document.querySelector("#texteval").value;
    M = document.querySelector("#motifval").value;
    alphabet = document.querySelector("#alphabet").value;
    init(T,M);
}

////////////////////////////////////////////////////////////////
// Fonctions
////////////////////////////////////////////////////////////////

function initBS(m) {
    // Calcul du tableau des bons suffixes du motif m
    ////////////////////////////////////////////////////////////
    var bs = [];
    for (var j=0;j<m.length;j++){
        bs.push(m.length);
        var d = 1;
        while ((d<m.length) && (bs[j]==m.length)) {
            i = j + 1;
            while ((i<m.length) && ((i-d<0) || (m[i-d]==m[i]))) i++;
            if ((i==m.length) && ((j-d<0) || (m[j-d]!=m[j]))) bs[j] = d;
            d++
        }
    }
    return bs;
}

function init(t,m) {
    // Initialisation à partir du texte t et du motif m
    ////////////////////////////////////////////////////////////
    // Fabrication des cartes du texte 
    carteT = [];
    var texte = document.querySelector('#texte');
    texte.textContent="";
    for (k=0;k<25;k=k+1) {
        carte = document.createElement("div");
        carte.classList.add("carte");
        if (k < t.length) carte.textContent=t[k];
        else carte.textContent="\u00a0";
        carteT.push(carte);
        texte.appendChild(carte);
    }
    // Fabrication des cartes du motif 
    carteM = [];
    var motif = document.querySelector('#motif');
    document.querySelector('#cache').style.width="calc(calc(var(--largeurCarte) + 12px) * "+m.length+")";
    motif.textContent="";
    for (k=0;k<m.length;k=k+1) {
        carte = document.createElement("div");
        carte.classList.add("carte");
        carte.textContent=m[k];
        carte.addEventListener('click',evnt => {
            c = evnt.target;
            j = 0;
            while (c != carteM[j]) j++;
            compare(j);
            });
        carteM.push(carte);
        motif.appendChild(carte);
    }
    //Mauvais caractères
    document.querySelector('#checkmc').checked = false;
    document.querySelector('#checkmc').dispatchEvent(new Event('change'));
    var splitmc = document.querySelector("#mc");
    splitmc.innerHTML = "<h1><span>Mauvais caractère<span></h1>";
    for (k=0;k<alphabet.length;k++) {
        var mc = document.createElement("div");
        mc.classList.add("mc");
        mc.id="mc"+alphabet[k];
        mc.appendChild(document.createElement("span"));
        var divdessus = document.createElement("div");
        divdessus.classList.add("dessus");
        var divcarte = document.createElement("div");
        divcarte.classList.add("carte");
        divcarte.innerHTML=alphabet[k];
        divdessus.appendChild(divcarte);
        mc.appendChild(divdessus);   
        splitmc.appendChild(mc);     
    }
    var choixmc=document.createElement("div");
    choixmc.classList.add("etoile");
    choixmc.style.right="0px";
    choixmc.id ="choixMC";
    choixmc.innerHTML ="0";
    choixmc.addEventListener("click",evt=>{avance(parseInt(evt.target.innerHTML));},false);
    splitmc.appendChild(choixmc);
    var mc = {};
    for (k=0;k<alphabet.length;k++) mc[alphabet[k]]=m.length;
    for (k=0;k<m.length-1;k++) mc[m[k]] = m.length-k-1;
    for (k=0;k<alphabet.length;k++) document.querySelector("#mc"+alphabet[k]).firstChild.innerHTML=mc[alphabet[k]];
    mauvaisCaractere = mc;
    //Bon suffixe
    document.querySelector('#checkbs').checked = false;
    document.querySelector('#checkbs').dispatchEvent(new Event('change'));
    var splitbs = document.querySelector("#bs");
    splitbs.innerHTML = "<h1><span>Bon suffixe<span></h1>";
    var choixbs=document.createElement("div");
    choixbs.classList.add("etoile");
    choixbs.id ="choixBS";
    choixbs.innerHTML ="0";
    choixbs.addEventListener("click",evt=>{avance(parseInt(evt.target.innerHTML));},false);
    splitbs.appendChild(choixbs);
    for (k=0;k<m.length;k++) {
        var bs = document.createElement("div");
        bs.classList.add("bs");
        bs.id="bs"+k;
        bs.appendChild(document.createElement("span"));
        bs.lastChild.innerHTML="0";
        var divdessous = document.createElement("div");
        divdessous.classList.add("dessous");
        var divcarte = document.createElement("div");
        divcarte.classList.add("carte");
        divcarte.innerHTML=m[k];
        divdessous.appendChild(divcarte);
        bs.appendChild(divdessous);
        var divdessus = document.createElement("div");
        divdessus.classList.add("dessus");
        var divjeton = document.createElement("div");
        divjeton.classList.add("jetonBS");
        divjeton.appendChild(document.createElement("div"));
        divjeton.lastChild.innerHTML=k;
        divdessus.appendChild(divjeton);
        bs.appendChild(divdessus);
        splitbs.appendChild(bs);     
    }
    var bs = initBS(m);
    for (k=0;k<m.length;k++) document.querySelector("#bs"+k).firstChild.innerHTML=bs[k];
    bonSuffixe = bs;
    avance(0);
}

function positionne(pos) {
    // Positionne la fenêtre de recherche à la position pos
    ////////////////////////////////////////////////////////////
    // Supprime la couleur de fond des cartes du motif
    for (j=0;j<M.length;j++) {
        carteM[j].classList.remove("fondNO");
        carteM[j].classList.remove("fondOK");
    }
    // Supprime la couleur de fond des cartes du texte visibles
    for (i=0;i<T.length;i++) {
        carteT[i].classList.remove("fondNO");
        carteT[i].classList.remove("fondOK");
    }
    // Positionne la fenêtre
    document.querySelector('#cache').style.left="calc(calc(calc(var(--largeurCarte) + 12px) * "+pos+") - var(--largeurTexte))";
    // Positionne le jeton i
    document.querySelector('.indicei').style.left="calc(calc(var(--largeurCarte) + 12px) * "+pos+".25)"; 
    // Positionne le jeton j
    if (reverse) document.querySelector('.indicej').style.left="calc(calc(var(--largeurCarte) + 12px) * "+(M.length-1+pos)+".25)"; 
    else document.querySelector('.indicej').style.left="calc(calc(var(--largeurCarte) + 12px) * "+pos+".25)";
    // Met à jour l'enregistrement de la position du motif
    positionM = pos;
}

function avance(k) {
    // Annime l'avancé de la fenêtre de k lettres 
    // et les comparaisons si elles sont automatiques
    ////////////////////////////////////////////////////////////
    if (testencours != null) clearTimeout(testencours);
    positionne(positionM+k);
    if (positionM>=T.length-M.length) setTimeout(lambda => {positionne(T.length-M.length);}, 250);
    if (positionM<0) setTimeout(lambda => {positionne(0);}, 250);
    if (autotest) {
        if (reverse) testencours = setTimeout(lambda => {testereverse(M.length-1)}, 250);
        else testencours = setTimeout(lambda => {teste(0)}, 250);
    }
}
  
function compare(j) {
    // Compare la lettre d'indice j du motif avec le texte
    // (Change le visuel du fond des cartes)
    ////////////////////////////////////////////////////////////
    if (M[j]==T[positionM+j]) {
        carteM[j].classList.add("fondOK");
        carteT[positionM+j].classList.add("fondOK");
        return true;
    }
    else {
        carteM[j].classList.add("fondNO");
        carteT[positionM+j].classList.add("fondNO");
        return false;
    }
}

function testereverse(k) {
    // Anime le test du matif de droite à gauche
    ////////////////////////////////////////////////////////////
    // Supprime les indications de mc et bs
    if (k==M.length-1) {
        for (j=0;j<alphabet.length;j++) document.querySelector("#mc"+alphabet[j]).lastChild.lastChild.classList.remove("fondNO");
        for (j=0;j<M.length;j++) {
            document.querySelector("#bs"+j).querySelector(".carte").classList.remove("fondOK");
            document.querySelector("#bs"+j).querySelector(".carte").classList.remove("fondNO");
        }
    }
    // Anime le test
    document.querySelector('.indicej').style.left="calc(calc(var(--largeurCarte) + 12px) * "+(positionM+k)+".25)";
    if (compare(k)) {
        document.querySelector('.indicej').style.left="calc(calc(var(--largeurCarte) + 12px) * "+(positionM+k-1)+".25)";
        if (k==0) {
            document.querySelector("#choixMC").innerHTML="0";
            document.querySelector("#choixBS").innerHTML="+"+bonSuffixe[0];
        }
        else testencours = setTimeout(lambda => {testereverse(k-1)}, 250);
        document.querySelector("#bs"+k).querySelector(".carte").classList.add("fondOK");
    } else {
        // Calcul de l'avancé par le mauvaus caractère
        var mcp = k-M.length+1+mauvaisCaractere[T[positionM+k]];
        if (mcp>0) document.querySelector("#choixMC").innerHTML="+"+mcp;
        else document.querySelector("#choixMC").innerHTML=mcp;
        document.querySelector("#mc"+T[positionM+k]).lastChild.lastChild.classList.add("fondNO");
        // Calcul de l'avancé par le bon suffixe
        document.querySelector("#choixBS").innerHTML="+"+bonSuffixe[k];
        document.querySelector("#bs"+k).querySelector(".carte").classList.add("fondNO");
    }
    
}

function teste(k) {
    // Anime le test du motif de gauche à droite
    ////////////////////////////////////////////////////////////
    document.querySelector('.indicej').style.left="calc(calc(var(--largeurCarte) + 12px) * "+(positionM+k)+".25)";
    if (compare(k)) {
        document.querySelector('.indicej').style.left="calc(calc(var(--largeurCarte) + 12px) * "+(positionM+k+1)+".25)"; 
        if (k<M.length-1) testencours = setTimeout(lambda => {teste(k+1)}, 250);
    }
}