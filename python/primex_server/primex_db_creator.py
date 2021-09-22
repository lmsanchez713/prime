#!/usr/bin/env python

import mysql.connector
import json

with open('/code/mysql.json', 'r') as arquivo_json_mysql:
    credenciais_mysql = json.load(arquivo_json_mysql)
    mysql_db = mysql.connector.connect(host="localhost", user=credenciais_mysql["usuario"], password=credenciais_mysql["senha"])
    mysql_cursor = mysql_db.cursor()
    mysql_cursor.execute("DROP DATABASE IF EXISTS primex;")
    mysql_cursor.execute("CREATE DATABASE primex;")
    mysql_cursor.execute("USE primex;")
    mysql_cursor.execute("CREATE TABLE usuarios(id_usuario INT UNSIGNED PRIMARY KEY AUTO_INCREMENT);")