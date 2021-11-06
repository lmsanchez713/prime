from binance.websocket.spot.websocket_client import SpotWebsocketClient
from binance.lib.utils import config_logging
import time
import logging

config_logging(logging, logging.DEBUG)

def message_handler(message):
    print(message)

ws_client = SpotWebsocketClient()
ws_client.start()

ws_client.mini_ticker(
    symbol='bnbusdt',
    id=1,
    callback=message_handler,
)

# Combine selected streams
ws_client.instant_subscribe(
    stream=['bnbusdt@bookTicker', 'ethusdt@bookTicker'],
    callback=message_handler,
)

time.sleep(10)

ws_client.stop()