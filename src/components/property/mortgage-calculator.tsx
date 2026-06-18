"use client";

import { useState, useMemo } from "react";
import { computeMortgage } from "@/lib/mortgage";
import { gbp } from "@/lib/format";
import { Field, Input } from "@/components/ui/field";

export function MortgageCalculator({ defaultPrice }: { defaultPrice: number }) {
  const [price, setPrice] = useState(defaultPrice);
  const [deposit, setDeposit] = useState(Math.round(defaultPrice * 0.1));
  const [rate, setRate] = useState(5.5);
  const [term, setTerm] = useState(25);

  const result = useMemo(
    () => computeMortgage({ price, deposit, rate, termYears: term }),
    [price, deposit, rate, term],
  );

  return (
    <div className="grid border border-line lg:grid-cols-[1.2fr_1fr]">
      <div className="p-6 sm:p-8">
        <Field label="Property price">
          <Input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} />
        </Field>
        <Field label="Deposit">
          <Input type="number" min={0} value={deposit} onChange={(e) => setDeposit(Number(e.target.value) || 0)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Interest rate (%)">
            <Input type="number" min={0} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} />
          </Field>
          <Field label="Term (years)">
            <Input type="number" min={1} value={term} onChange={(e) => setTerm(Number(e.target.value) || 1)} />
          </Field>
        </div>
        <p className="mt-1 text-[0.74rem] text-muted">
          Indicative repayment figures only. Not a mortgage offer or financial advice.
        </p>
      </div>
      <div className="flex flex-col justify-center bg-ink p-6 text-white sm:p-8">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/60">Estimated monthly repayment</p>
        <p className="my-1 font-display text-5xl">{gbp(result.monthly)}</p>
        <p className="text-[0.82rem] text-white/55">Capital &amp; interest</p>
        <dl className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-[0.85rem]">
          <div className="flex justify-between"><dt className="text-white/60">Loan amount</dt><dd className="font-semibold">{gbp(result.loan)}</dd></div>
          <div className="flex justify-between"><dt className="text-white/60">Loan to value</dt><dd className="font-semibold">{result.ltv}%</dd></div>
          <div className="flex justify-between"><dt className="text-white/60">Total interest</dt><dd className="font-semibold">{gbp(result.totalInterest)}</dd></div>
          <div className="flex justify-between"><dt className="text-white/60">Total repayable</dt><dd className="font-semibold">{gbp(result.totalRepayable)}</dd></div>
        </dl>
      </div>
    </div>
  );
}
