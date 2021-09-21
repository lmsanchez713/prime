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

var contador_de_requisicoes = 0;
var requisicoes = {};

var saida;

function enviar_requisicao(requisicao) {

    if (typeof requisicao === "object") {//} && requisicao.hasOwnProperty("cmd")) {

        requisicoes[contador_de_requisicoes] = requisicao;

        requisicao["req_id"] = contador_de_requisicoes;

        contador_de_requisicoes += 1;

        requisicao = JSON.stringify(requisicao);

        //se conectado, enviar; se não, adicionar req_id à fila de envio

    }

}

function receber_requisicao(requisicao) {

    if (typeof requisicao === "string") {

        requisicao = JSON.parse(requisicao);

        if (typeof requisicao === "object") {

            console.log(requisicao);

        }

    }

}

function inicializar() {

    document.getElementById("div-conteudo-principal").style.visibility = "visible";

    saida = document.getElementById("div-saida");

    saida.innerHTML += "Iniciando conexão WebSockets com o servidor Pytão...";

    wss = new WebSocket('wss://formatafacil.com.br:9713');

    saida.innerHTML += "<br>OK<br>Trocando dados...<br>Enviando 'Lucas'";

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

        //agendar reconexão

    };

    wss.onerror = function (evt) {

        console.log("wss.onerror")

        // wss.send(JSON.stringify({ ticks: 'R_100' }));

        //agendar reconexão ?

    };

    wss.onmessage = function (msg) {

        console.log("wss.onmessage")

        // var data = JSON.parse(msg.data);
        // console.log('ticks update: %o', data);
        // saida.innerHTML += "<br>OK<br>Dados recebidos: '" + msg.data + "'";

        //processar mensagens; esse trecho

    };

    enviar_requisicao({ "criar_usuario": { "usuario":"lucas", "senha":"123456789" } });
    enviar_requisicao({ "login": { "usuario":"lucas", "senha":"123456789" } });
    enviar_requisicao({ "logout": "lucas" });

    console.log(jsdump(requisicoes));

}
