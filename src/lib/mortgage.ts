export interface MortgageInput {
  price: number;
  deposit: number;
  rate: number; // annual %, e.g. 5.5
  termYears: number;
}

export interface MortgageResult {
  loan: number;
  monthly: number;
  totalRepayable: number;
  totalInterest: number;
  ltv: number; // %
}

export function computeMortgage({ price, deposit, rate, termYears }: MortgageInput): MortgageResult {
  const loan = Math.max(price - deposit, 0);
  const monthlyRate = rate / 100 / 12;
  const n = Math.max(termYears * 12, 1);
  let monthly: number;
  if (monthlyRate === 0) {
    monthly = loan / n;
  } else {
    monthly = (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  }
  if (!isFinite(monthly)) monthly = 0;
  const totalRepayable = monthly * n;
  return {
    loan,
    monthly,
    totalRepayable,
    totalInterest: totalRepayable - loan,
    ltv: price > 0 ? Math.round((loan / price) * 100) : 0,
  };
}
