import { Button } from "@/components/ui";

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-8 px-6 text-center">
      <span className="rounded-full border border-border bg-secondary px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Realconnect v2
      </span>
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold sm:text-5xl">
          연결을 새롭게 정의하는 커뮤니티 플랫폼
        </h1>
        <p className="text-muted-foreground sm:text-lg">
          FSD 아키텍처와 shadcn/ui 컴포넌트를 기반으로 한 Realconnect v2의
          프론트엔드입니다. Pretendard 폰트를 기본값으로 사용합니다.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="sm:w-auto">
          프로젝트 살펴보기
        </Button>
        <Button variant="outline" size="lg" className="sm:w-auto">
          문서 확인하기
        </Button>
      </div>
    </main>
  );
}
