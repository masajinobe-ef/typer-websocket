#!/bin/bash

# Define the source and output directories
SRC_DIR="./src"
OUT_DIR="./dist"

# Create the output directory if it doesn't exist
mkdir -p "$OUT_DIR"

# Function to compile TypeScript files
compile() {
    echo "Compiling TypeScript files from $SRC_DIR to $OUT_DIR..."
    tsc --project tsconfig.json --outDir "$OUT_DIR" --target ESNext

    # Check if the compilation was successful
    if [ $? -eq 0 ]; then
        echo "Compilation successful."
    else
        echo "Compilation failed."
        exit 1
    fi
}

# Function to run the compiled JavaScript files
run() {
    # Run the server
    if [ -f "$OUT_DIR/server.js" ]; then
        echo "Starting the server..."
        node "$OUT_DIR/server.js" &
        SERVER_PID=$!
        echo "Server started with PID $SERVER_PID."

        # Wait a moment to ensure the server is up and running
        sleep 2 # Задержка в 2 секунды
    else
        echo "Error: $OUT_DIR/server.js not found."
        exit 1
    fi

    # Run the client
    if [ -f "$OUT_DIR/client.js" ]; then
        echo "Starting the client..."
        node "$OUT_DIR/client.js"
    else
        echo "Error: $OUT_DIR/client.js not found."
        exit 1
    fi

    # Wait for the server to finish
    wait $SERVER_PID
}

# Check for the --run argument
if [ "$1" == "--run" ]; then
    compile
    run
else
    compile
fi
