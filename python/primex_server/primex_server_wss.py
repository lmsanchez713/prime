#!/usr/bin/env python

# WSS (WS over TLS) server example, with a self-signed certificate

# start_server = websockets.serve(hello, "140.82.31.140", 9713, ssl=ssl_context)

import asyncio
import websockets
import sys
# import pathlib
import ssl
import hashlib

#hash = hashlib.sha512( str( "teste" ).encode("utf-8") ).hexdigest()

async def ainput(string: str) -> str:
    # await asyncio.get_event_loop().run_in_executor(
    #         None, lambda s=string: sys.stdout.write(s+' '))
    return await asyncio.get_event_loop().run_in_executor(
            None, sys.stdin.readline)

async def hello(websocket, path):
    callbacks = {}
    # reqs = {}

    async for name in websocket:
        # name = await websocket.recv()
        print(f"< {name}")

        greeting = f"Hello {name}!"

        await websocket.send(greeting)
        print(f"> {greeting}")

async def server_proc(parada, ssl_context):
    async with websockets.serve(hello, "140.82.31.140", 9713, ssl=ssl_context):# as websockets_server:
        await parada

async def main(parada, server_ws):
    saida_solicitada = False
    while saida_solicitada == False:
        # entrada = input("> ")
        entrada = await ainput("")
        entrada = entrada[:-1]
        # print(entrada)
        # print(len(entrada))
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

# start_server = websockets.serve(hello, "127.0.0.1", 9713)

parada = loop.create_future()

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
# localhost_pem = pathlib.Path(__file__).with_name("localhost.pem")
# certfile = pathlib.Path(__file__).with_name("/var/www/certs/formatafacil.com.br/cert-chain.crt")
# keyfile = pathlib.Path(__file__).with_name("/var/www/certs/formatafacil.com.br/cert.key")
# ssl_context.load_cert_chain(certfile, keyfile)
# ssl_context.minimum_version = ssl.TLSVersion.TLSv1_3
ssl_context.minimum_version = ssl.TLSVersion.MAXIMUM_SUPPORTED
ssl_context.load_cert_chain("/var/www/certs/formatafacil.com.br/cert-chain.crt", "/var/www/certs/formatafacil.com.br/cert.key")

server_ws = loop.create_task(server_proc(parada, ssl_context))
loop.run_until_complete(main(parada, server_ws))
# asyncio.get_event_loop().run_forever()

print("Saindo do servidor... Obrigado!")
