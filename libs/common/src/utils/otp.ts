export const GenerateOTP = (digits) => {
    const numberOfDigits = digits;
    let randomDigits = '';
  
    for (let i = 0; i < numberOfDigits; i++) {
      const randomDigit = Math.floor(Math.random() * 10); // Generates a random digit from 0 to 9
      randomDigits += randomDigit;
    }
  
    return randomDigits;
  }