function jsdump(arr, level) {
    var dumped_text = "";
    if (!level) level = 0;
    var level_padding = "";
    for (var j = 0; j < level + 1; j++) level_padding += "    ";
    if (typeof (arr) == 'object') {
        for (var item in arr) {
            var value = arr[item];
            if (typeof (value) == 'object') {
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += jsdump(value, level + 1);
            }
            else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    }
    else {
        dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
    }
    return dumped_text;
}

var wss;
var manter_conexao_wss_aberta = true;
var contador_de_requisicoes = 0;
var requisicoes = {};

var saida;

function enviar_requisicao(requisicao) {

    console.log("enviar_requisicao")

    if (typeof requisicao === "object") {//} && requisicao.hasOwnProperty("cmd")) {

        requisicoes[contador_de_requisicoes] = requisicao;

        requisicao["req_id"] = contador_de_requisicoes;

        contador_de_requisicoes += 1;

        requisicao = JSON.stringify(requisicao);

        //se conectado, enviar; se não, adicionar req_id à fila de envio

    }

}

function receber_requisicao(requisicao) {

    console.log("receber_requisicao")

    if (typeof requisicao === "string") {

        requisicao = JSON.parse(requisicao);

        if (typeof requisicao === "object") {

            console.log(requisicao);

        }

    }

}

function inicializar_websocket_principal() {

    wss = new WebSocket('wss://formatafacil.com.br:9713');

    wss.onopen = function (evt) {

        console.log("wss.onopen")

        // wss.send(JSON.stringify({ ticks: 'R_100' }));

        // wss.send("Mike");
        // saida.innerHTML += "<br>OK<br>Recebendo dados...";

        //puxar layout padrão do servidor

    };

    wss.onclose = function (evt) {

        console.log("wss.onclose")

        // wss.send(JSON.stringify({ ticks: 'R_100' }));

        if (manter_conexao_wss_aberta) {

            setTimeout(() => {
                inicializar_websocket_principal();
            }, timeout);

        }

    };

    // wss.onerror = function (evt) {}; // processar erro...

    wss.onmessage = function (msg) {

        console.log("wss.onmessage")

        // var data = JSON.parse(msg.data);
        // console.log('ticks update: %o', data);
        // saida.innerHTML += "<br>OK<br>Dados recebidos: '" + msg.data + "'";

        //processar mensagens; esse trecho

    };

}

function inicializar() {

    var div_conteudo_principal = document.getElementById("div-conteudo-principal");

    div_conteudo_principal.style.visibility = "visible";
    div_conteudo_principal.style.opacity = 1;

    saida = document.getElementById("div-saida");

    saida.innerHTML += "Iniciando conexão WebSockets com o servidor Pytão...";

    saida.innerHTML += "<br>OK<br>Trocando dados...<br>Enviando 'Lucas'";

    inicializar_websocket_principal();

    enviar_requisicao({ "criar_usuario": { "usuario": "lucas", "senha": "123456789" } });
    enviar_requisicao({ "login": { "usuario": "lucas", "senha": "123456789" } });
    enviar_requisicao({ "logout": "lucas" });

    console.log(jsdump(requisicoes));

}
