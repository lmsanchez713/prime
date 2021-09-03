#!/bin/bash
git pull
sudo rm -r /var/www/formatafacil.com.br
sudo cp -r /code/prime/web/primex_client /var/www/formatafacil.com.br
