def hex_to_decimal(num_bits, hex_str):
    # Remove '0x' prefix if present
    hex_str = hex_str.replace('0x', '').lower()
    
    # Convert hex to binary string
    binary = format(int(hex_str, 16), f'0{num_bits}b')
    
    # Check if number is negative (MSB = 1)
    if binary[0] == '1':
        # Subtract 1 and invert bits
        inverted = ''.join('1' if bit == '0' else '0' for bit in binary)
        decimal = -(int(inverted, 2) + 1)
    else:
        decimal = int(binary, 2)
    
    return decimal

def main():
    try:
        num_bits = int(input("Enter number of bits: "))
        if num_bits % 4 != 0:
            raise ValueError("Number of bits must be a multiple of 4")
        
        hex_input = input("Enter number in hex (with or without 0x prefix): ")
        
        decimal = hex_to_decimal(num_bits, hex_input)
        print(f"\nDecimal value: {decimal}")
        
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()