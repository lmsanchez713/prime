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
var requisicao_de_login = 0;

var saida;

function enviar_requisicao(requisicao) {

    console.log("enviar_requisicao");

    if (typeof requisicao === "object") {//} && requisicao.hasOwnProperty("cmd")) {

        contador_de_requisicoes += 1;

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

        return contador_de_requisicoes;

    }

    return 0;

}

function receber_requisicao(requisicao) {

    console.log("receber_requisicao");

    if (typeof requisicao === "string") {

        requisicao = JSON.parse(requisicao);

        if (typeof requisicao === "object") {

            console.log(jsdump(requisicao));

            //return req_id
            return 0;

        }

    }

    return 0;

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

function reportar_login(mensagem) {

    var report_login = document.getElementById("report-login");

    if (mensagem.length) {

        report_login.innerHTML = mensagem;
        report_login.style.display = "block";

    }

    else {

        report_login.innerHTML = "";
        report_login.style.display = "none";

    }

}

function resetar_form_login() {

    var campo_login = document.getElementById("input-login-usuario");
    var campo_senha = document.getElementById("input-login-senha");
    var checkbox_lembrar = document.getElementById("input-login-lembrar");
    var botao_login = document.getElementById("botao-login");
    var botao_cadastro = document.getElementById("botao-cadastro");

    campo_login.value = "";
    campo_senha.value = "";
    checkbox_lembrar.checked = false;
    botao_login.innerHTML = "Fazer login";
    botao_cadastro.innerHTML = "Cadastre-se";

    campo_login.removeAttribute("disabled");
    campo_senha.removeAttribute("disabled");
    checkbox_lembrar.removeAttribute("disabled");
    botao_login.removeAttribute("disabled");
    botao_cadastro.removeAttribute("disabled");

    reportar_login("");

}

function fazer_login(cadastrar) {

    // var modal_login = document.getElementById("modal-login");
    var campo_login = document.getElementById("input-login-usuario");
    var campo_senha = document.getElementById("input-login-senha");
    var checkbox_lembrar = document.getElementById("input-login-lembrar");
    var botao_login = document.getElementById("botao-login");
    var botao_cadastro = document.getElementById("botao-cadastro");

    if ((campo_login.value.length > 0) && (campo_senha.value.length > 0)) {

        // modal_login.setAttribute("data-bs-backdrop", "static");
        // modal_login.setAttribute("data-bs-keyboard", "false");
        campo_login.setAttribute("disabled", "");
        campo_senha.setAttribute("disabled", "");
        checkbox_lembrar.setAttribute("disabled", "");
        botao_login.setAttribute("disabled", "");
        botao_cadastro.setAttribute("disabled", "");
        if (!cadastrar) botao_login.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Fazendo login...';
        else botao_cadastro.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Cadastrando...';

        reportar_login("");

        async_sha512(campo_login.value).then(function (hash_usuario) {

            senha_com_sal = campo_senha.value + hash_usuario;

            async_sha512(senha_com_sal).then(function (hash_senha) {

                if (!cadastrar) {

                    requisicao_de_login = enviar_requisicao({
                        "login": {
                            "usuario": campo_login.value, "senha": hash_senha, "lembrar": checkbox_lembrar.checked
                        }
                    });

                }

                else {

                    requisicao_de_login = enviar_requisicao({
                        "criar_usuario": {
                            "usuario": campo_login.value, "senha": hash_senha, "lembrar": checkbox_lembrar.checked
                        }
                    });

                }

            });
        });

    }

    else {

        if ((campo_login.value.length == 0) && (campo_senha.value.length == 0)) {

            reportar_login("Campos usuário e senha não podem ser vazios");

        }

        else if (campo_login.value.length == 0) {

            // function remover_status_login_invalido() {
            //     campo_login.classList.remove("is-invalid");
            //     campo_login.removeEventListener("input", remover_status_login_invalido);
            // }

            // campo_login.classList.add("is-invalid");
            // campo_login.addEventListener("input", remover_status_login_invalido);

            // setTimeout(remover_status_login_invalido, 3000);

            reportar_login("Campo usuário não pode ser vazio");

        }

        else if (campo_senha.value.length == 0) {

            // function remover_status_senha_invalida() {
            //     campo_senha.classList.remove("is-invalid");
            //     campo_senha.removeEventListener("input", remover_status_senha_invalida);
            // }

            // campo_senha.classList.add("is-invalid");
            // campo_senha.addEventListener("input", remover_status_senha_invalida);

            // setTimeout(remover_status_senha_invalida, 3000);

            reportar_login("Campo senha não pode ser vazio");

        }

    }

}

function inicializar() {

    // console.log("inicializar");

    var modal_login = document.getElementById('modal-login');

    modal_login.addEventListener('hidden.bs.modal', function () {

        if (requisicao_de_login == 0) resetar_form_login();

    });

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

// $("#modal-login").on('hidden', function () {
//     remover_status_login_invalido();
//     remover_status_senha_invalida();
//     alert("HEY");
// });
