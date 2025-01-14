def decimal_to_two_complement(num_bits, number):
    if number >= 0:
        binary = format(number, f'0{num_bits}b')
        # Calculate minimum hex digits needed
        hex_digits = (num_bits + 3) // 4  # Round up division
        hex_val = format(number, f'0{hex_digits}x')
    else:
        abs_binary = format(abs(number), f'0{num_bits}b')
        inverted = ''.join('1' if bit == '0' else '0' for bit in abs_binary)
        two_comp = int(inverted, 2) + 1
        binary = format(two_comp, f'0{num_bits}b')
        hex_digits = (num_bits + 3) // 4
        hex_val = format(two_comp, f'0{hex_digits}x')
    return binary, hex_val

def print_range(num_bits):
    if num_bits < 1:
        raise ValueError("Number of bits must be positive")
    
    min_val = -(2 ** (num_bits - 1))
    max_val = (2 ** (num_bits - 1)) - 1
    
    # Print header
    print(f"\n{num_bits}-bit Two's Complement Range:")
    print("-" * 50)
    print(f"{'Decimal':>8} | {'Binary':^{num_bits}} | {'Hexadecimal':^{num_bits//4+2}}")
    print("-" * 50)
    
    # Print each number in range
    for num in range(min_val, max_val + 1):
        binary, hex_val = decimal_to_two_complement(num_bits, num)
        print(f"{num:8d} | {binary:>{num_bits}} | 0x{hex_val:>{(num_bits+3)//4}}")

def main():
    try:
        num_bits = int(input("Enter number of bits: "))
        if num_bits < 1:
            raise ValueError("Number of bits must be positive")
        # Removed the multiple of 4 check
        print_range(num_bits)
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()