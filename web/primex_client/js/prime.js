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

async function async_sha512(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

var wss;
var manter_conexao_wss_aberta = true;
var contador_de_requisicoes = 0;
var requisicoes = {};
var fila_de_requisicoes_de_saida = [];

var saida;

function enviar_requisicao(requisicao) {

    console.log("enviar_requisicao");

    if (typeof requisicao === "object") {//} && requisicao.hasOwnProperty("cmd")) {

        requisicao["req_id"] = contador_de_requisicoes;

        requisicoes[contador_de_requisicoes] = requisicao;

        console.log(jsdump(requisicao));

        //se conectado, enviar; se não, adicionar req_id à fila de envio
        if (wss.readyState == WebSocket.OPEN) {

            wss.send(JSON.stringify(requisicao));

        }

        else {

            fila_de_requisicoes_de_saida.push(contador_de_requisicoes);

        }

        contador_de_requisicoes += 1;

    }

}

function receber_requisicao(requisicao) {

    console.log("receber_requisicao");

    if (typeof requisicao === "string") {

        requisicao = JSON.parse(requisicao);

        if (typeof requisicao === "object") {

            console.log(jsdump(requisicao));

        }

    }

}

function inicializar_websocket_principal() {

    // console.log("inicializar_websocket_principal");

    wss = new WebSocket('wss://formatafacil.com.br:9713');

    wss.onopen = function (evt) {

        // console.log("wss.onopen");

        // wss.send(JSON.stringify({ ticks: 'R_100' }));

        // wss.send("Mike");
        // saida.innerHTML += "<br>OK<br>Recebendo dados...";

        //enviar requisições pendentes
        while (fila_de_requisicoes_de_saida.length) {

            var req_id_atual = fila_de_requisicoes_de_saida.shift();

            wss.send(JSON.stringify(requisicoes[req_id_atual]));

        }

        //puxar layout padrão do servidor

    };

    wss.onclose = function (evt) {

        // console.log("wss.onclose");

        // wss.send(JSON.stringify({ ticks: 'R_100' }));

        if (manter_conexao_wss_aberta) {

            setTimeout(() => {
                inicializar_websocket_principal();
            }, 3000);

        }

    };

    // wss.onerror = function (evt) {}; // processar erro...

    wss.onmessage = function (mensagem) {

        // console.log("wss.onmessage");

        // var data = JSON.parse(msg.data);
        // console.log('ticks update: %o', data);
        // saida.innerHTML += "<br>OK<br>Dados recebidos: '" + msg.data + "'";

        //processar mensagens
        receber_requisicao(mensagem.data);

    };

}

function fazer_login(cadastrar) {

    var campo_login = document.getElementById("input-login-usuario");
    var campo_senha = document.getElementById("input-login-senha");
    var checkbox_lembrar = document.getElementById("input-login-lembrar");

    if ((campo_login.value.length > 0) && (campo_senha.value.length > 0)) {

        async_sha512(campo_login.value).then(function (hash_usuario) {

            senha_com_sal = campo_senha.value + hash_usuario;

            async_sha512(senha_com_sal).then(function (hash_senha) {

                enviar_requisicao({
                    "login": {
                        "usuario": campo_login.value, "senha": hash_senha, "lembrar": checkbox_lembrar.checked
                    }
                });

            });
        });

    }

    else {

        if (campo_login.value.length == 0) {

            function remover_status_login_invalido() {
                campo_login.classList.remove("is-invalid");
                campo_login.removeEventListener("input", remover_status_login_invalido);
            }

            campo_login.classList.add("is-invalid");
            campo_login.addEventListener("input", remover_status_login_invalido);

            // setTimeout(remover_status_login_invalido, 3000);

        }

        if (campo_senha.value.length == 0) {

            function remover_status_senha_invalida() {
                campo_senha.classList.remove("is-invalid");
                campo_senha.removeEventListener("input", remover_status_senha_invalida);
            }

            campo_senha.classList.add("is-invalid");
            campo_senha.addEventListener("input", remover_status_senha_invalida);

            // setTimeout(remover_status_senha_invalida, 3000);

        }

    }

}

function inicializar() {

    // console.log("inicializar");

    var div_conteudo_principal = document.getElementById("div-conteudo-principal");

    div_conteudo_principal.style.visibility = "visible";
    div_conteudo_principal.style.opacity = 1;

    saida = document.getElementById("div-saida");

    saida.innerHTML += "Iniciando conexão WebSockets com o servidor Pytão...";

    saida.innerHTML += "<br>OK<br>Trocando dados...<br>Enviando 'Lucas'";

    inicializar_websocket_principal();

    enviar_requisicao({
        "criar_usuario": {
            "usuario": "lucas", "senha":
                "d93eed61a9581944256d2c101012aa18f07a1901ca53a40a0f47d61a4fb12e5b60e3bee70966b406e274441df8eca4bf8fdd2871a3e2ae33ff35063d08ac807d"
        }
    });
    enviar_requisicao({
        "login": {
            "usuario": "lucas", "senha":
                "d93eed61a9581944256d2c101012aa18f07a1901ca53a40a0f47d61a4fb12e5b60e3bee70966b406e274441df8eca4bf8fdd2871a3e2ae33ff35063d08ac807d"
        }
    });
    enviar_requisicao({ "logout": "lucas" });

    // console.log(jsdump(requisicoes));
    // console.log(jsdump(fila_de_requisicoes_de_saida));

}

$("#modal-login").on('hidden.bs.modal', function () {
    remover_status_login_invalido();
    remover_status_senha_invalida();
});
