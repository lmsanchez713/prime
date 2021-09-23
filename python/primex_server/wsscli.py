#!/usr/bin/env python

# WSS (WS over TLS) client example, with a self-signed certificate

# import asyncio
# import pathlib
# import ssl
# import websockets
import hashlib

# ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
# localhost_pem = pathlib.Path(__file__).with_name("localhost.pem")
# ssl_context.load_verify_locations(localhost_pem)

# async def hello():
#     uri = "wss://formatafacil.com.br:9713"
#     async with websockets.connect(
#         uri, ssl=True
#     ) as websocket:
#         name = input("What's your name? ")

#         await websocket.send(name)
#         print(f"> {name}")

#         greeting = await websocket.recv()
#         print(f"< {greeting}")

# asyncio.get_event_loop().run_until_complete(hello())

hash = hashlib.sha512( str( "teste" ).encode("utf-8") )
hashdig = hash.hexdigest()
print(hash)
print(hashdig)
print(hash.digest())
