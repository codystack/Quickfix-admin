export default function generateRandomCode(letters: string, length = 8) {
  const numberChars = '0123456789';

  // Ensure the coupon contains at least one of each required character type
  const couponArray = [
    letters[Math.floor(Math.random() * letters.length)],
    numberChars[Math.floor(Math.random() * numberChars.length)],
    // specialChars[Math.floor(Math.random() * specialChars.length)],
  ];

  // Fill the rest of the coupon length with random characters from all sets
  const allChars = letters + numberChars;
  for (let i = couponArray.length; i < length; i+=1) {
    couponArray.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Shuffle the coupon array to ensure randomness
  const shuffledCoupon = couponArray.sort(() => Math.random() - 0.5);

  return shuffledCoupon.join('');
}

// // Example usage
// const randomCoupon = generateRandomCoupon();
// console.log(randomCoupon);
