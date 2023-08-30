////////////////////////////////////////////////////////////////////////////////////
//////////////////////////              INIT              //////////////////////////
////////////////////////////////////////////////////////////////////////////////////

var simbol = 0;
var valor = 0;
var naipe = "";
var color = "";

var players = new Array(0, 1);
players[0] = {vez:true, name:"", pontos:0, vitorias:0}
players[1] = {vez:false, name:"", pontos:0, vitorias:0}

var turno = 0;
var empates = 0;
var rodadas = 0;

var cards = new Array();
var cardsPlayed = new Array();

for(var i = 0; i <= 3; i++){
    var cardNumber = new Array();
    for(var n = 0; n <= 13; n++){
        cardNumber[n] = n;
    }
    cards[i] = cardNumber;
    switch (i) {
        case 0:
            cards[0][0] = "copas";        
            break;
        case 1:
            cards[1][0] = "ouros"
            break;
        case 2:
            cards[2][0] = "paus"
            break;
        case 3:
            cards[3][0] = "espada"
            break;
    }
}

// console.log(cards);


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////             entrar()           //////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function enterGame(){
    players[0].name = document.querySelector("#player1").value;
    players[1].name = document.querySelector("#player2").value;

    if(players[0].name == ""){
        players[0].name = "Player 1";
    }

    if(players[1].name == ""){
        players[1].name = "Player 2";
    }

    entrar();
}

function entrar() {
    
    reinitialize();

    updateView();

    initGame();

}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////           updateView()         //////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function updateView() {

    document.querySelectorAll(".cards-box")[0].innerHTML = "";
    document.querySelectorAll(".cards-box")[1].innerHTML = "";

    document.querySelector(".player1Name").innerHTML = players[0].name + "<span class=\"points\"></span>";
    document.querySelector(".player2Name").innerHTML = players[1].name + "<span class=\"points\"></span>";

    document.querySelector(".placarPlayer1").innerHTML = players[0].name + ": " + players[0].vitorias;
    document.querySelector(".placarPlayer2").innerHTML = players[1].name + ": " + players[1].vitorias;

    document.querySelector(".placarEmpates").innerHTML = empates;
    document.querySelector(".placarRodadas").innerHTML = rodadas;

    document.querySelector(".login").style.display = "none";
    document.querySelector(".game").style.display = "flex";

}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////             vezDe()            //////////////////////////
////////////////////////////////////////////////////////////////////////////////////
function vezDe(){
    if (players[0].vez && players[1].vez == false){
        return 0;
    }
    if (players[1].vez && players[0].vez == false){
        return 1;
    }
}

function setVezDe(vez){
    if (vez == 0){
        players[0].vez = true;
        players[1].vez = false;
        return 0;
    }
    if (vez == 1){
        players[1].vez = true;
        players[0].vez = false;
        return 1;
    }
}



////////////////////////////////////////////////////////////////////////////////////
//////////////////////////           createCard()         //////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function createCard(player){
    var card = `
    <div class="card">
        <div class="card-number ${color}">
            ${valor}
        </div>
        <div class="card-naipe ${naipe}"></div>
    </div>
    `;

    document.querySelectorAll(".cards-box")[player].innerHTML += card;
        if (players[vezDe()].pontos > 21 ){
            setTimeout(function(){
                
                document.querySelectorAll(".cards-box")[vezDe()].innerHTML += "<div class=\"explosion\"></div>";
                trocaTurno();
            }, 1000);
        
        } else if (players[vezDe()].pontos == 21){
            trocaTurno();
        }

    document.querySelector(".message").innerHTML = "Vez dê: "+players[vezDe()].name; 
   
}

function initGame(){
    dispareGame();
    dispareGame();
    rodadas++;
}



////////////////////////////////////////////////////////////////////////////////////
//////////////////////////           verifyCards()        //////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function verifyCards(Pnaipe, Pvalor) {
    let verify = Pnaipe + "-" + Pvalor;
    if(!(cardsPlayed.includes(verify))){
        cardsPlayed.push(verify); 
        return true;
    }
    return false;
}




////////////////////////////////////////////////////////////////////////////////////
//////////////////////////        cardsGenerator()        //////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function cardsGenerator() {
    
    naipe = cards[parseInt(Math.random() * 3)][0];
    valor = parseInt(Math.random() * 13 + 1);


    if(verifyCards(naipe, valor)){
        players[vezDe()].pontos += valor;
        
        document.querySelectorAll(".points")[vezDe()].innerHTML = " Pontos: " + players[vezDe()].pontos;

        switch (naipe) {
            case "ouros":
                color = "red";
                break;
            case "copas":
                color = "red";
                break;
            default:
                color = "";
                break;
        }

        switch (valor) {
            case 1: 
                valor = "A";
                break;
            case 11:
                valor = "J";
                break;
            case 12:
                valor = "Q";
                break;
            case 13:
                valor = "K"
                break;
        }

        return createCard(vezDe());

    } else {
        return cardsGenerator();
    }
}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////         dispareGame()          //////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function dispareGame() {
    if(players[vezDe()].pontos >= 16 && players[vezDe()].pontos <= 21 ){
        return modal("warning", players[vezDe()].name+", escolha uma opção", "Deseja parar ou comprar mais uma carta?", "YESNO");
    } else if ( players[vezDe()].pontos > 21 ){
        return modalClose();
    }
    return cardsGenerator();
}



////////////////////////////////////////////////////////////////////////////////////
//////////////////////////         reinitialize()          //////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function reinitialize() {
    turno = 0;
    players[0].pontos = 0;
    players[1].pontos = 0;
    cardsPlayed = new Array();
    let vezrandom = parseInt(Math.random() * 2);
    setVezDe(vezrandom);
}






///////////////////////////////////////////////////////////////////////////////////
//////////////////////////         trocaTurno()          //////////////////////////
////////////////////////////////////////////////////////////////////////////////////



function trocaTurno() {
    modalClose();
    turno++;
    if (turno == 1){
        if (vezDe() == 0){
            setVezDe(1);
        } else if (vezDe() == 1){
            setVezDe(0);
        }
        dispareGame();
        dispareGame();
        document.querySelectorAll(".cards-box")[1].style.display = "flex";
        document.querySelectorAll(".points")[1].style.display = "inline";
        return 1;
    } else if (turno == 2){
        setTimeout(function(){
            selectWinner()
        }, 400);
    }
}



///////////////////////////////////////////////////////////////////////////////////
//////////////////////////         selectWinner()          //////////////////////////
////////////////////////////////////////////////////////////////////////////////////


function selectWinner(){


    if (players[0].pontos == players[1].pontos ) {

        alert(players[0].name + " e "+ players[1].name +" empartaram com "+players[1].pontos+" pontos");
        empates++;

    } else if( players[0].pontos == 21  ){

        alert(players[0].name +" ganhou com 21 pontos");
        players[0].vitorias++;

    } else if( players[1].pontos == 21  ){
        
        alert(players[1].name +" ganhou com 21 pontos");
        players[1].vitorias++;

    } else if ( ((players[0].pontos) - 21 <= 0 ) && ((players[1].pontos) - 21 <= 0 ) ) {

        if (players[0].pontos > players[1].pontos){

            alert(players[0].name +" ganhou com "+players[0].pontos+" pontos");
            players[0].vitorias++;

        } else {

            alert(players[1].name +" ganhou com "+players[1].pontos+" pontos");
            players[1].vitorias++;

        }

    } else if ( ((players[0].pontos) - 21 >= 0 ) && ((players[1].pontos) - 21 >= 0 ) ){

        alert("Ninguém ganhou esta rodada");
        empates++;

    } else if (players[0].pontos <= 21 && players[1].pontos > 21) {
            alert(players[0].name +" ganhou com "+players[0].pontos+" pontos");
            players[0].vitorias++;
    } else if (players[1].pontos <= 21 && players[0].pontos > 21) {

        alert(players[1].name +" ganhou com "+players[1].pontos+" pontos");
        players[1].vitorias++;

    }
    
    entrar();

}



////////////////////////////////////////////////////////////////////////////////////
//////////////////////////             modal()            //////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function modal(style, title, message, buttons = "") {

    if(turno == 2){
        return 0;
    }

        document.querySelector(".modal-title").innerHTML = title;

        document.querySelector(".modal-message").innerHTML = message;

        document.querySelector(".modal").style.display = "flex";
        document.querySelector(".modal").style.animation = "open .5s normal";

        if (style == "success") {
            document.querySelector(".modal-header").style.backgroundColor = "#43e97b";
        } else if (style == "danger") {
            document.querySelector(".modal-header").style.backgroundColor = "#fa4d53";
        } else if (style == "warning") {
            document.querySelector(".modal-header").style.backgroundColor = "#ffac53";
        }

        if(buttons == "YESNO"){
            document.querySelector(".modal-message").innerHTML += `<button class="btn btn-success" onclick="modalClick('sim')">Pedir</button><button class="btn btn-danger" onclick="modalClick('nao')">Parar</button>            `;
        }
}
function modalClose(){
    document.querySelector(".modal").style.animation = "close .5s infinite";

    setTimeout(()=>{
        document.querySelector(".modal").style.display = "none";
    }, 480);
}
function modalClick(response){
    if (response == "sim"){
        modalClose();
        cardsGenerator(vezDe());
    }
    if (response == "nao"){
        modalClose();
        setTimeout(function(){
            trocaTurno();
        }, 200)
        
    }
}