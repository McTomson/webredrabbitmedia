#!/bin/bash
# Helper script to start the server with Node 20
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"

# Determine path to Node 20
NODE_PATH=$(nvm which 20)

if [ -z "$NODE_PATH" ]; then
    echo "Node 20 not found via nvm. Installing..."
    nvm install 20
    NODE_PATH=$(nvm which 20)
fi

echo "Using Node: $NODE_PATH"
"$NODE_PATH" node_modules/next/dist/bin/next dev -p 3000
