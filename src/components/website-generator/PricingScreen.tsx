import { Check, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PRICING_PLANS } from '../../config';

interface Props {
  onSelect: (planId: string) => void;
}

function priceLabel(price: number) {
  if (price === 0) return '무료';
  return '₩' + price.toLocaleString('ko-KR');
}

export function PricingScreen({ onSelect }: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            생성 완료 · 배포 단계
          </div>
          <h2 className="text-2xl font-bold text-slate-900">웹사이트를 배포할 준비가 됐어요</h2>
          <p className="mt-2 text-slate-500">
            먼저 무료로 배포해 결과를 확인하고, 필요하면 실제 배포로 업그레이드하세요.
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
                onClick={() => onSelect(plan.id)}
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
    </div>
  );
}
