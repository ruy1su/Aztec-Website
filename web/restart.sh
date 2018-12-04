#!/bin/bash

node_modules/forever/bin/forever stopall
node_modules/forever/bin/forever start deploy_server.js
node_modules/forever/bin/forever start server.js

