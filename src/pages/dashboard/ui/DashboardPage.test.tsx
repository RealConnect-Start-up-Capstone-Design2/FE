import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { isDemoRuntimeMock } = vi.hoisted(() => ({
  isDemoRuntimeMock: vi.fn(),
}));

vi.mock("@/demo/session", () => ({
  isDemoRuntime: isDemoRuntimeMock,
}));

import { DashboardPage } from "./DashboardPage";

describe("DashboardPage data-source boundary", () => {
  beforeEach(() => {
    isDemoRuntimeMock.mockReset();
  });

  it("renders the connected demo dashboard only in demo mode", () => {
    isDemoRuntimeMock.mockReturnValue(true);

    const html = renderDashboard();

    expect(html).toContain("중개 업무 대시보드");
    expect(html).toContain("샘플한빛공인중개사사무소");
    expect(html).toContain("전체 매물");
  });

  it("never renders demo office, customers, or KPIs in API mode", () => {
    isDemoRuntimeMock.mockReturnValue(false);

    const html = renderDashboard();

    expect(html).toContain("운영 데이터 모드");
    expect(html).toContain("실데이터 대시보드 집계는 아직 연결되지 않았습니다");
    expect(html).not.toContain("샘플한빛공인중개사사무소");
    expect(html).not.toContain("김데모");
    expect(html).not.toContain("전체 매물");
  });
});

function renderDashboard(): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  );
}
