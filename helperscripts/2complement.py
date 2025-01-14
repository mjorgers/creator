def decimal_to_two_complement(num_bits, number):
    # Validate inputs
    if num_bits < 1:
        raise ValueError("Number of bits must be positive")
    
    # Check range
    max_val = 2**(num_bits - 1) - 1
    min_val = -(2**(num_bits - 1))
    if number > max_val or number < min_val:
        raise ValueError(f"Number out of range for {num_bits} bits: [{min_val}, {max_val}]")
    
    # Convert to two's complement
    if number >= 0:
        binary = format(number, f'0{num_bits}b')
        hex_val = format(number, f'0{(num_bits + 3) // 4}x')
    else:
        # For negative numbers: get absolute, invert bits, add 1
        abs_binary = format(abs(number), f'0{num_bits}b')
        inverted = ''.join('1' if bit == '0' else '0' for bit in abs_binary)
        two_comp = int(inverted, 2) + 1
        binary = format(two_comp, f'0{num_bits}b')
        hex_val = format(two_comp, f'0{(num_bits + 3) // 4}x')
    
    return binary, hex_val

def main():
    try:
        num_bits = int(input("Enter number of bits: "))
        number = int(input("Enter the number: "))
        binary, hex_val = decimal_to_two_complement(num_bits, number)
        print(f"\n{number} in {num_bits}-bit representation:")
        print(f"Binary: {binary}")
        print(f"Hex: 0x{hex_val}")
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()