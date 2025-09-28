import React from "react";
import { Layout } from "@shared/ui";
import { DashboardWidget } from "@widgets/dashboard/DashboardWidget";

export const DashboardPage = () => {
  return (
    <Layout>
      <DashboardWidget />
    </Layout>
  );
};
