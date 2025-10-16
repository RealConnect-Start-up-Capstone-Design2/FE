import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import PlusIcon from "@/assets/Plus.svg";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { MainComplexModal } from "@/shared/components/MainComplexModal";
import type { ComplexData } from "@/shared/types/complex";

export function PropertyManagerHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const options = [
    { label: "단지 추가", value: "add-property" },
    { label: "단지 수정", value: "edit-property" },
    { label: "단지 삭제", value: "delete-property" },
  ];

  const handleSaveComplexes = async (complexes: ComplexData[]) => {
    console.log("Saving complexes:", complexes);
    // TODO: 실제 API 호출
    alert(`${complexes.length}개의 주거래 단지가 저장되었습니다.`);
  };

  return (
    <>
      <PageHeader title="매물장">
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex flex-row gap-3 justify-between">
            <div className="flex flex-row gap-3">
              <Button
                className="bg-[#1B1B1B]"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="text-white font-semibold">단지 추가</span>
                <img src={PlusIcon} alt="plus" />
              </Button>
              <DropdownMenu
                className="w-67 font-semibold"
                placeholder="단지 선택"
                options={options}
              />
              <div className="w-98">
                <InputGroup>
                  <InputGroupInput placeholder="전화번호 검색" />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="flex flex-row gap-3">
              <DropdownMenu
                className="font-semibold"
                placeholder="즐겨찾기"
                options={options}
              />
              <InputGroup className="w-32 h-12">
                <InputGroupAddon align="block-start">
                  <InputGroupInput placeholder="동 검색" />
                  <Search />
                </InputGroupAddon>
              </InputGroup>
              <InputGroup className="w-32">
                <InputGroupAddon align="block-start">
                  <InputGroupInput placeholder="호 검색" />
                  <Search />
                </InputGroupAddon>
              </InputGroup>
              <DropdownMenu
                className="font-semibold"
                placeholder="면적 선택"
                options={options}
              />
              <DropdownMenu
                className="font-semibold"
                placeholder="의뢰 유형"
                options={options}
              />
              <DropdownMenu
                className="font-semibold"
                placeholder="매물 상태"
                options={options}
              />
            </div>
          </div>
        </div>
      </PageHeader>

      <MainComplexModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveComplexes}
      />
    </>
  );
}
