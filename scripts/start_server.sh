#!/bin/bash
echo "Starting the blockchain"
(cd /home/ubuntu/geth-PoA-Private-Blockchain/node1/ geth --networkid 12345 --datadir "./data" --bootnodes "enode://b09236e951e87f5d5d8b742d07a9b52a5e0f4d77af6611efb585a99372ff50d5f5147e7993c337d25989f3ede326b9bcbe3a2ef99b78cb566132c91694e3f6ed@172.31.37.206:0?discport=30301" --port 30303 --ipcdisable --syncmode full --http --allow-insecure-unlock --http.api 'web3,eth,net,debug,personal' --http.corsdomain '*' --http.vhosts "*" --http.addr "0.0.0.0" --http.port 8547 --unlock 0xC2197823D2d6A14E58945E50206f683D01eC10f3 --password password.txt --mine --miner.etherbase 0xC2197823D2d6A14E58945E50206f683D01eC10f3 console)

