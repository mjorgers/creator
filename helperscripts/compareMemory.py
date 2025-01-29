import re
from typing import Dict, List, Tuple
from colorama import init, Fore, Style
import os
init()

def parse_memory(filename: str) -> Dict[str, str]:
    memory_contents = {}
    with open(filename, 'r') as f:
        for line in f:
            match = re.match(r'memory\[(0x[0-9a-fA-F]+)\]:(0x[0-9a-fA-F]+)', line.strip())
            if match:
                address, value = match.groups()
                memory_contents[int(address, 16)] = int(value, 16)
    return memory_contents

def get_word_at_address(mem: Dict[int, int], base_addr: int) -> int:
    word = 0
    for offset in range(4):
        byte = mem.get(base_addr + (3 - offset), 0)
        word |= (byte & 0xFF) << (offset * 8)
    return word

def compare_memory_files(file1: str, file2: str) -> None:
    try:
        mem1 = parse_memory(file1)
        mem2 = parse_memory(file2)
        
        # Get filenames without paths
        fname1 = os.path.basename(file1)
        fname2 = os.path.basename(file2)
        
        # Get all base addresses (aligned to 4 bytes)
        all_addresses = sorted({addr & ~0x3 for addr in set(mem1.keys()) | set(mem2.keys())})
        
        print("=" * 50)
        print(f"{'Address':11} {fname1:15} {fname2:15}")
        print("-" * 50)
        
        for addr in all_addresses:
            word1 = get_word_at_address(mem1, addr)
            word2 = get_word_at_address(mem2, addr)
            
            if word1 != word2:
                print(f"0x{addr:08x}  {Fore.RED}0x{word1:08x}    0x{word2:08x}{Style.RESET_ALL}")
            else:
                print(f"0x{addr:08x}  0x{word1:08x}    0x{word2:08x}")


    except FileNotFoundError as e:
        print(f"Error: Could not find file - {e}")
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 3:
        print("Usage: python compareMemory.py <file1> <file2>")
        sys.exit(1)
    
    compare_memory_files(sys.argv[1], sys.argv[2])