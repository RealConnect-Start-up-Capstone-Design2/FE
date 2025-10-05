import {
  PropertyManagerHeader,
  PropertyManageTable,
} from "@/features/propertyManage";

export function PropertyManagePage() {
  return (
    <div className="overflow-visible">
      <PropertyManagerHeader />
      <PropertyManageTable />
    </div>
  );
}
