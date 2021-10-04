#!/usr/bin/env python

import asyncio
import websockets
import sys
import ssl
import hashlib
import json
import mysql.connector


credenciais_mysql = {}
mysql_db = None
sql_login = ("SELECT usuario FROM usuarios WHERE usuario = '%s' AND senha = '%s';")
sql_criar_usuario = ("INSERT INTO usuarios(usuario, senha) VALUES('%s', '%s');")


async def ainput(string: str) -> str:
    # await asyncio.get_event_loop().run_in_executor(None, lambda s=string: sys.stdout.write(s+' '))
    return await asyncio.get_event_loop().run_in_executor(None, sys.stdin.readline)


async def primex_main(websocket, path):
    mysql_cursor = mysql_db.cursor(prepared=True)

    async for mensagem in websocket:

        print("Processando requisição")

        print(mensagem)

        requisicao = json.loads(mensagem)

        # req_id = requisicao["req_id"]
        # requisicao.pop("req_id")
        req_id = requisicao.pop("req_id")

        for comando in requisicao.items():
            if comando[0] == "login":
                print("Login")
            elif comando[0] == "logout":
                print("Logout")
            elif comando[0] == "criar_usuario":
                print("Criar usuário")
                print(vars(comando[1]))
                #hash = hashlib.sha512( str( "teste" ).encode("utf-8") ).hexdigest()
                # hash_usuario = hashlib.sha512( str( "teste" ).encode("utf-8") ).hexdigest()

        cmd = comando[0]

        resposta = f'{{"req_id":{req_id},"{cmd}":{{"status":"erro","mensagem":"Servidor em manutenção"}}}}'

        await websocket.send(resposta)
        print(f"Requisição respondida: {resposta}")


async def server_proc(parada, ssl_context):
    # as websockets_server:
    async with websockets.serve(primex_main, "140.82.31.140", 9713, ssl=ssl_context):
        await parada


async def main(parada, server_ws):
    saida_solicitada = False
    while saida_solicitada == False:
        entrada = await ainput("")
        entrada = entrada[:-1]
        if entrada == "exit":
            print("Saída solicitada")
            saida_solicitada = True
    print("Encerrando servidor websockets")
    parada.set_result(0)
    await server_ws


print("Mimes Broker Server v1.0.0.0")
print("Digite seu comando ou 'exit' para sair")

loop = asyncio.get_event_loop()
# loop.set_debug(True)

parada = loop.create_future()

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
# ssl_context.minimum_version = ssl.TLSVersion.TLSv1_3
ssl_context.minimum_version = ssl.TLSVersion.MAXIMUM_SUPPORTED
ssl_context.load_cert_chain("/var/www/certs/formatafacil.com.br/cert-chain.crt",
                            "/var/www/certs/formatafacil.com.br/cert.key")

with open('/code/mysql.json', 'r') as arquivo_json_mysql:
    credenciais_mysql = json.load(arquivo_json_mysql)
    mysql_db = mysql.connector.connect(
        host="localhost", user=credenciais_mysql["usuario"], password=credenciais_mysql["senha"], database="primex")

server_ws = loop.create_task(server_proc(parada, ssl_context))
loop.run_until_complete(main(parada, server_ws))

print("Saindo do servidor... Obrigado!")
