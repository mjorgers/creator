.text
main:
    # Test register-based shifts
    li s0, 1                 # Shift amount in register
    li s3, 0xFFFFFFFF        # Load same test value
    sllw s4, s3, s0          # Register-based left shift
    srlw s5, s4, s0          # Register-based right shift