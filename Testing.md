# CREATOR Build Script

## Introduction

This script is designed to run tests for different architectures, specifically RISC-V and MIPS. The script automates the testing process by running various test categories and comparing the actual output with expected results. Its main use is regression testing.

The script can be run from the command line to execute tests on different architectures with options for filtering based on categories.

### Basic Command

```bash
python test.py
```

### Options

- **`--arch`**: Filter tests by architecture. Acceptable values are `riscv` or `mips`.
  ```bash
  python test.py --arch riscv
  ```

- **`--category`**: Filter by test category (e.g., examples, syscalls).
  ```bash
  python test.py --category examples
  ```

- **`--list`**: List available architectures and categories.
  ```bash
  python test.py --list
  ```

- **`--nocolor`**: Disable colored output for test results. Useful when saving the output to a file
  ```bash
  python test.py --nocolor
  ```

  To save the output:
  ```bash
  python test.py --nocolor > report.txt
  ```