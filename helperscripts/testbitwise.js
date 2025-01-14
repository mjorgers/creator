function addiw(rs1, imm) {
    // Convert inputs to BigInt if they aren't already
    rs1 = BigInt(rs1);
    imm = BigInt(imm);

    // Add and take lower 32 bits
    const result = (rs1 + imm) & 0xFFFFFFFFn;

    // Sign-extend to 64 bits
    return result & 0x80000000n ? result | 0xFFFFFFFF00000000n : result;

}

// Test cases
const testCases = [
    [0x7FFFFFFFn, 1n],           // Positive overflow
    [0x80000000n, -1n],          // Negative overflow
    [0x12345678n, 0n],           // Zero immediate
    [-1n, 1n],                   // Negative value
    [0x7FFFFFFEn, 1n],           // Regular addition
];

for (const [rs1, imm] of testCases) {
    console.log(`addiw(0x${rs1.toString(16)}, ${imm}) = 0x${addiw(rs1, imm).toString(16)}`);
}