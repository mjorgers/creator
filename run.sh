#!/bin/bash

# Define paths
ARCH_FILE="./architecture/RISC_V_RV32IMFD.json"
TEST_FILE="./test/riscv/correct/examples/test_riscv_example_008.s"
OUTPUT_FILE="finalstate.txt"
EXPECTED_FILE="correct.txt"

# Run creator.js with proper error handling
if ! node creator.mjs -a "$ARCH_FILE" -s "$TEST_FILE" -o pretty > "$OUTPUT_FILE"; then
    echo "Error: creator.js execution failed"
    exit 1
fi

# Compare memory states
if ! python ./helperscripts/compareMemory.py "$EXPECTED_FILE" "$OUTPUT_FILE"; then
    echo "Error: Memory comparison failed"
    exit 1
fi