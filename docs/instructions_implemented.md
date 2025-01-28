
# Shift Instructions

## Shift Word Operations

These operations perform 32-bit shifts on RV64I architecture, where the result is sign-extended to 64 bits.

### Shift Left Logical Word (SLLW)
SLLW performs a logical left shift on the lower 32 bits of rs1 by the shift amount (shamt).

- First masks the input to 32 bits (& 0xFFFFFFFFn)
- Shifts left by shamt positions
- Upper 32 bits of the result are cleared
- Result is sign-extended to 64 bits

```javascript
if (shamt > 0) {
    const temp = ((BigInt(rs1) & 0xFFFFFFFFn) << BigInt(shamt)) & 0xFFFFFFFFn;
    rd = temp & 0x80000000n ? temp | 0xFFFFFFFF00000000n : temp;
    rd = capi_int2uint(rd);
}
```

### Shift Right Logical Word (SRLW)
- First masks the input to 32 bits (& 0xFFFFFFFFn)
- Shifts right by shamt positions
- Zeros are shifted in from the left
- Result is sign-extended to 64 bits
```javascript
if (shamt > 0) {
    const temp = ((BigInt(rs1) & 0xFFFFFFFFn) >> BigInt(shamt)) & 0xFFFFFFFFn;
    rd = temp & 0x80000000n ? temp | 0xFFFFFFFF00000000n : temp;
    rd = capi_int2uint(rd);
}
```

## Shift Operations

These operations perform 64-bit shifts on RV64I architecture.

### Shift Left Logical (SLL)
SLL performs a logical left shift on the bits of rs1 by the shift amount (shamt).

- Shifts left by shamt positions

```javascript
if (shamt > 0) {
    rd = capi_int2uint(rs1 << shamt);
}
```

### Shift Right Logical (SRL)
SRL performs a logical right shift on the bits of rs1 by the shift amount (shamt).

- Shifts right by shamt positions

```javascript
if (shamt > 0) {
    rd = capi_int2uint(rs1 >> shamt);
}
```

### Shift Right Arithmetic (SRA)

SRA performs an arithmetic right shift on the bits of rs1 by the shift amount (shamt).

- Shifts right by shamt positions
- Copies the sign bit into the leftmost bits, preserving the sign of the number

```javascript
if (shamt > 0) {
    rd = (BigInt.asIntN(64,rs1) >> shamt);
}
```
