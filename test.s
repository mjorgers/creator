.text
main:
# Load 0xCAFEBEEFCAFEBEEF to x4 and copy it to x5
lui x4, 0xCAFEB
addi x4, x4, 0xEEF
slli x4, x4, 12
addi x4, x4, 0xCAF
slli x4, x4, 12
addi x4, x4, 0xEBE
slli x4, x4, 8
addi x4, x4 0xEF
mv x5 x4
add x5 x4 x5