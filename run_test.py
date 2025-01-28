import os
import subprocess
import sys

def run_test_category(category_name, test_numbers, base_path, lib_path=None):
    """Run tests for a specific category"""
    print(f"\n RISC-V {category_name}:")
    error = 0
    
    for test_num in test_numbers:
        test_num = f"{test_num:03d}"
        print(f" * {base_path}_{test_num}: ", end="")
        
        # Build command
        cmd = ["./creator.sh", 
               "-a", "./architecture/RISC_V_RV32IMFD.json",
               "-s", f"{base_path}_{test_num}.s",
               "-o", "min"]
        
        # Add library if specified
        if lib_path:
            cmd.extend(["-l", f"{lib_path}_{test_num}.o"])
            
        # Run test
        output_file = f"/tmp/e-{test_num}.out"
        try:
            with open(output_file, 'w') as f:
                subprocess.run(cmd, stdout=f, check=True)
            
            # Compare outputs
            expected_file = f"{base_path}_{test_num}.out"
            with open(output_file, 'r') as f1, open(expected_file, 'r') as f2:
                if f1.read() == f2.read():
                    print("Equals")
                else:
                    print(f"Different: Error {test_num} with different outputs...")
                    error = 1
        except Exception as e:
            print(f"Error: {str(e)}")
            error = 1
        finally:
            if os.path.exists(output_file):
                os.remove(output_file)
    
    return error

def run_all_tests():
    error = 0
    
    # Test categories with their patterns
    test_categories = {
        "examples": {
            "numbers": [2, 3, 4, 5, 6, 7, 8, 11, 12],
            "path": "./test/riscv/correct/examples/test_riscv_example"
        },
        "libraries": {
            "numbers": range(1, 2),
            "path": "./test/riscv/correct/libraries/test_riscv_libraries",
            "has_lib": True
        },
        "syscalls": {
            "numbers": [1, 2, 3, 4, 9, 10, 11],
            "path": "./test/riscv/correct/syscalls/test_riscv_syscall"
        },
        "compile common errors": {
            "numbers": [1, 2, 3, 4, 5, 6, 7, 8, 9, 14, 15, 16, 17, 18, 19, 21, 22, 23, 30],
            "path": "./test/riscv/error/compiler/test_riscv_error_compiler"
        },
        "execution common errors": {
            "numbers": range(1, 10),
            "path": "./test/riscv/error/executor/test_riscv_error_executor"
        },
        "passing convention": {
            "numbers": range(1, 37),
            "path": "./test/riscv/sentinel/test_riscv_sentinels"
        },
        "instructions": {
            "numbers": range(1, 66),
            "path": "./test/riscv/instructions/test_riscv_instruction"
        }
    }
    
    # Run all test categories
    for category, config in test_categories.items():
        lib_path = config["path"] if config.get("has_lib") else None
        result = run_test_category(
            category,
            config["numbers"],
            config["path"],
            lib_path
        )
        error |= result
    
    return error

if __name__ == "__main__":
    run_all_tests()