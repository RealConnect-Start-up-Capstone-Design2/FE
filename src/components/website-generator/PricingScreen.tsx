import { useState } from 'react';
import { Check, CreditCard, Loader2, Lock, MapPin, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PRICING_PLANS } from '../../config';
import type { PricingPlan } from './types';
import { useCrmContext } from './useCrmContext';

interface Props {
  onSelect: (planId: string) => void;
}

function priceLabel(price: number) {
  if (price === 0) return '무료';
  return '₩' + price.toLocaleString('ko-KR');
}

export function PricingScreen({ onSelect }: Props) {
  const ctx = useCrmContext();
  // 유료 플랜 선택 시 뜨는 결제창 대상 플랜 (null = 결제창 닫힘)
  const [payPlan, setPayPlan] = useState<PricingPlan | null>(null);
  const [paying, setPaying] = useState(false);

  function handlePlan(plan: PricingPlan) {
    if (plan.price === 0) {
      onSelect(plan.id); // 무료는 결제 없이 바로 생성
    } else {
      setPayPlan(plan); // 유료는 결제창 먼저
    }
  }

  function handlePay() {
    if (!payPlan) return;
    setPaying(true);
    // 결제 처리 연출 후 생성 시작 (실제 결제 아님)
    setTimeout(() => onSelect(payPlan.id), 1400);
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            <MapPin className="h-3.5 w-3.5" />
            {ctx.region} · 매물 {ctx.listingCount}건 연동 준비됨
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            플랜을 선택하면 웹사이트 생성이 시작됩니다
          </h2>
          <p className="mt-2 text-slate-500">
            {ctx.agencyName}의 매물 데이터를 기반으로 AI가 전용 웹사이트를 만들어 드려요.
            먼저 무료로 시작해 결과를 확인할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition',
                plan.highlight
                  ? 'border-brand-500 ring-2 ring-brand-500/30'
                  : 'border-slate-200',
              )}
            >
              {plan.badge && (
                <span
                  className={cn(
                    'mb-3 inline-block w-fit rounded-full px-2.5 py-1 text-xs font-semibold',
                    plan.highlight
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-500',
                  )}
                >
                  {plan.badge}
                </span>
              )}
              <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-1 mb-5">
                <span className="text-3xl font-black text-slate-900">
                  {priceLabel(plan.price)}
                </span>
                {plan.price > 0 && <span className="text-sm text-slate-400"> / 1회</span>}
              </p>

              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 shrink-0 text-brand-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlan(plan)}
                className={cn(
                  'rounded-xl py-3 text-sm font-semibold transition',
                  plan.highlight
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50',
                )}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          결제는 데모용 화면입니다. 실제 비용이 청구되지 않습니다.
        </p>
      </div>

      {/* 결제창 — 유료 플랜 선택 시 */}
      {payPlan && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <CreditCard className="h-5 w-5 text-brand-600" />
                결제
              </div>
              {!paying && (
                <button
                  onClick={() => setPayPlan(null)}
                  className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="px-5 py-5">
              {/* 주문 요약 */}
              <div className="mb-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {payPlan.name} 플랜
                  </p>
                  <p className="text-xs text-slate-500">웹사이트 생성 · 1회 결제</p>
                </div>
                <p className="text-xl font-black text-slate-900">
                  ₩{payPlan.price.toLocaleString('ko-KR')}
                </p>
              </div>

              {/* 카드 정보 (데모) */}
              <div className="space-y-3">
                <Field label="카드 번호">
                  <input
                    defaultValue="4242 4242 4242 4242"
                    inputMode="numeric"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="유효기간">
                    <input
                      defaultValue="12 / 28"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                    />
                  </Field>
                  <Field label="CVC">
                    <input
                      defaultValue="123"
                      inputMode="numeric"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                    />
                  </Field>
                </div>
                <Field label="카드 소유자">
                  <input
                    defaultValue={ctx.agentName}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                  />
                </Field>
              </div>

              <button
                onClick={handlePay}
                disabled={paying}
                className={cn(
                  'mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition',
                  paying
                    ? 'cursor-not-allowed bg-brand-400'
                    : 'bg-brand-600 hover:bg-brand-700',
                )}
              >
                {paying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    결제 처리 중…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />₩{payPlan.price.toLocaleString('ko-KR')}{' '}
                    결제하기
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                데모용 결제 화면입니다. 실제 비용이 청구되지 않습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  );
}
