function reverseBinaryCoercion(coercedString) {
  const reversedBinary = [];
  
  // Iterate over each character in the string
  for (let i = 0; i < coercedString.length; i++) {
    const charCode = coercedString.charCodeAt(i);
    
    // Since UTF-16 uses 16-bit units, we extract both the higher and lower byte
    const highByte = (charCode & 0xFF00) >> 8;  // Extracts the higher byte
    const lowByte = charCode & 0x00FF;           // Extracts the lower byte

    // Push these byte values into the reversed binary array
    reversedBinary.push(highByte);
    reversedBinary.push(lowByte);
  }
  
  return new Uint8Array(reversedBinary.filter(byte => byte !== 0)); // Return the reversed binary
}

function testReverse() {
  // Example of coerced string data
  const coercedString = String.fromCharCode(0xFF, 0xFE, 0x01, 0x00); // Coerced example
  const binaryData = reverseBinaryCoercion(coercedString);
  
  Logger.log(binaryData); // Should match the original binary values
}