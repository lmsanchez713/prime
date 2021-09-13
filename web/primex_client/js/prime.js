// function mostrar_popup_login() {

//   var wrapper = document.getElementById("wrapper-popup");
//   wrapper.style.visibility = "visible";
//   wrapper.style.animationDirection = "normal";
//   wrapper.style.animationFillMode = "forwards";
//   wrapper.style.animationName = "anim-fade-in";

// }

// function ocultar_popup_login() {

//   var wrapper = document.getElementById("wrapper-popup");
//   // wrapper.style.animationDirection = "reverse";
//   // wrapper.style.animationFillMode = "backwards";
//   wrapper.style.animationName = "anim-fade-out";
//   setTimeout(function () {
//     document.getElementById("wrapper-popup").style.visibility = "hidden";
//   }, 1500);

// }

var ws;
var saida;
var contador_de_requisicoes = 0;
var requisicoes = {};

function receber_requisicao(requisicao) {

    if(typeof requisicao === "string") {

        requisicao = JSON.parse(requisicao);

    }

    if(typeof requisicao === "object") {

        console.log(requisicao);

    }

}

function inicializar() {

    receber_requisicao({ "chave" : "valor" });
    receber_requisicao('{ "chave" : "valor" }');

    return;

    document.getElementById("div-conteudo-principal").style.visibility = "visible";

    saida = document.getElementById("div-saida");

    saida.innerHTML += "Iniciando conexão WebSockets com o servidor Pytão...";

    ws = new WebSocket('wss://formatafacil.com.br:9713');

    saida.innerHTML += "<br>OK<br>Trocando dados...<br>Enviando 'Lucas'";

    ws.onopen = function (evt) {

        // ws.send(JSON.stringify({ ticks: 'R_100' }));

        ws.send("Mike");
        saida.innerHTML += "<br>OK<br>Recebendo dados...";

    };

    ws.onmessage = function (msg) {
        // var data = JSON.parse(msg.data);
        // console.log('ticks update: %o', data);
        saida.innerHTML += "<br>OK<br>Dados recebidos: '" + msg.data + "'";
    };

}
