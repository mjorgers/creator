from typing import Tuple

def get_twos_complement_range(bits: int) -> Tuple[int, int]:
    """Calculate min/max values for n-bit two's complement"""
    min_value = -(2 ** (bits - 1))
    max_value = (2 ** (bits - 1)) - 1
    return min_value, max_value

def format_binary(num: int, bits: int) -> str:
    """Format number as binary string with proper width"""
    if num < 0:
        # Handle negative numbers
        num = (1 << bits) + num
    return f"{num:0{bits}b}"

def print_range(bits: int) -> None:
    """Display range in decimal, hex, and binary formats"""
    min_val, max_val = get_twos_complement_range(bits)
    print(f"\n{bits}-bit range:")
    print(f"  Decimal: {min_val} to {max_val}")
    print(f"  Hex:    {min_val:#x} to {max_val:#x}")
    print(f"  Binary:  {format_binary(min_val, bits)} to {format_binary(max_val, bits)}")

def main():
    """Test with common bit widths"""
    for bits in [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,32]:
        print_range(bits)

if __name__ == "__main__":
    main()