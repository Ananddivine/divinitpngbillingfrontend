// Convert number to words
export const convertToWords = (amount) => {
    const units = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
      'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
    if (amount === 0) return 'Zero Rupees Only';
    if (amount < 0) return 'Negative amount is invalid';
  
    const numToWords = (num) => {
      if (num < 20) return units[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
      if (num < 1000) return units[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + numToWords(num % 100) : '');
      if (num < 100000) return numToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numToWords(num % 1000) : '');
      if (num < 10000000) return numToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numToWords(num % 100000) : '');
      return numToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + numToWords(num % 10000000) : '');
    };
  
    const words = numToWords(Math.floor(amount));
    const paise = Math.round((amount - Math.floor(amount)) * 100);
    return words + (paise > 0 ? ` and ${numToWords(paise)} Paise` : '') + ' Only';
  };
  