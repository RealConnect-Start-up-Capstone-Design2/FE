import { Label } from "@/components/ui/label";
import type { ApartmentWithProperty } from "../../stores/propertyStore";

interface Props {
  apartment?: ApartmentWithProperty;
}

export function PropertyFloorPlanBlock({ apartment }: Props) {
  const imageUrl = apartment?.img?.trim();
  const hasImage = Boolean(imageUrl);

  return (
    <section className="space-y-2">
      <Label className="block text-[20px] font-semibold text-black">
        평면도
      </Label>
      <div className="rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
        {hasImage ? (
          <img
            src={imageUrl}
            alt={`${apartment?.apartmentName ?? ""} 평면도`}
            className="w-full max-h-[360px] object-contain bg-white"
          />
        ) : (
          <div className="flex min-h-[200px] items-center justify-center text-gray-400">
            평면도 이미지가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
