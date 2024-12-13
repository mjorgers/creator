.text
main:
# Should load 0xCAFEBEEFCAFEBEEF to x1
lui x1, 0xCAFEB
addi x1, x1, 0xEEF
slli x1, x1, 12
addi x1, x1, 0xCAF
slli x1, x1, 12
addi x1, x1, 0xEBE
slli x1, x1, 8
addi x1, x1 0xEF