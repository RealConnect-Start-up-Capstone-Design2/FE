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

export function PropertyManagerHeader() {
  const options = [
    { label: "단지 추가", value: "add-property" },
    { label: "단지 수정", value: "edit-property" },
    { label: "단지 삭제", value: "delete-property" },
  ];

  return (
    <PageHeader title="매물장">
      <div className="flex flex-col gap-2.5 min-w-[1100px]">
        <div className="flex flex-row gap-3 justify-between">
          <div className="flex flex-row gap-3">
            <Button className="bg-[#1B1B1B]">
              <span className="text-white font-semibold">단지 추가</span>
              <img src={PlusIcon} alt="plus" />
            </Button>
            <DropdownMenu
              className="w-56 font-semibold"
              placeholder="단지 선택"
              options={options}
            />
          </div>
        </div>
        <div className="flex flex-row gap-3 justify-between">
          <div className="flex flex-row gap-3">
            <DropdownMenu
              className="font-semibold"
              placeholder="즐겨찾기"
              options={options}
            />
            <InputGroup className="w-36">
              <InputGroupAddon align="block-start">
                <InputGroupInput placeholder="동 검색" />
                <Search />
              </InputGroupAddon>
            </InputGroup>
            <InputGroup className="w-36">
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
          <div className="w-96">
            <InputGroup>
              <InputGroupInput placeholder="통합 검색(이름, 동, 호수, 전화번호 등)" />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>
    </PageHeader>
  );
}
