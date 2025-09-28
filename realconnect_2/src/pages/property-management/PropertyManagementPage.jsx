import React from "react";
import { Layout } from "@shared/ui";
import { PropertyManagementWidget } from "@widgets/property/PropertyManagementWidget";

export const PropertyManagementPage = () => {
  return (
    <Layout>
      <PropertyManagementWidget />
    </Layout>
  );
};
