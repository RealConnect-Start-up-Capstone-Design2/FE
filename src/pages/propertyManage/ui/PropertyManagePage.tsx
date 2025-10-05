import {
  PropertyManagerHeader,
  PropertyManageTable,
} from "@/features/propertyManage";

export function PropertyManagePage() {
  return (
    <div className="overflow-visible bg-gray-50 min-h-screen">
      <PropertyManagerHeader />
      <PropertyManageTable />
    </div>
  );
}
