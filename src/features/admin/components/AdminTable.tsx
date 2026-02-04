import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import type { RealtorMember, RealtorCertificationStatus } from "../types/admin";

interface AdminTableProps {
  data: RealtorMember[];
  onViewDetails: (memberId: string) => void;
}

const statusLabels: Record<RealtorCertificationStatus, string> = {
  approved: "승인",
  pending: "승인 대기",
  rejected: "반려",
  not_certified: "인증 전",
};

export function AdminTable({ data, onViewDetails }: AdminTableProps) {
  return (
    <div className="w-full h-full overflow-y-auto">
      <Table className="relative">
        <TableHeader className="sticky top-0 z-10 bg-[#EDEDED] rounded-t-lg">
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-[42px] w-[143px] text-[15px] font-medium leading-[1.193] tracking-[-0.025em] text-[#8D8D8D]">
              회원가입일
            </TableHead>
            <TableHead className="h-[42px] w-[137px] text-[15px] font-medium leading-[1.193] tracking-[-0.025em] text-[#8D8D8D]">
              대표자 성명
            </TableHead>
            <TableHead className="h-[42px] w-[160px] text-[15px] font-medium leading-[1.193] tracking-[-0.025em] text-[#8D8D8D]">
              대표자 연락처
            </TableHead>
            <TableHead className="h-[42px] w-[191px] text-[15px] font-medium leading-[1.193] tracking-[-0.025em] text-[#8D8D8D]">
              상호명
            </TableHead>
            <TableHead className="h-[42px] w-[199px] text-[15px] font-medium leading-[1.193] tracking-[-0.025em] text-[#8D8D8D]">
              사업장 대표 전화번호
            </TableHead>
            <TableHead className="h-[42px] w-[154px] text-[15px] font-medium leading-[1.193] tracking-[-0.025em] text-[#8D8D8D]">
              승인 요청일
            </TableHead>
            <TableHead className="h-[42px] w-[166px] text-[15px] font-medium leading-[1.193] tracking-[-0.025em] text-[#8D8D8D]">
              중개사 인증 상태
            </TableHead>
            <TableHead className="h-[42px] w-[124px] text-[15px] font-medium leading-[1.193] tracking-[-0.025em] text-[#8D8D8D]">
              정보 조회
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((member) => (
            <TableRow
              key={member.id}
              className="h-[60px] border-b border-[rgba(177,182,199,0.4)] hover:bg-gray-50/50"
            >
              <TableCell className="w-[143px] text-[13px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1B1B1B]">
                {member.registrationDate}
              </TableCell>
              <TableCell className="w-[137px] text-[13px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1B1B1B]">
                {member.ownerName}
              </TableCell>
              <TableCell className="w-[160px] text-[13px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1B1B1B]">
                {member.ownerPhone}
              </TableCell>
              <TableCell className="w-[191px] text-[13px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1B1B1B]">
                {member.businessName || "-"}
              </TableCell>
              <TableCell className="w-[199px] text-[13px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1B1B1B]">
                {member.businessPhone || "-"}
              </TableCell>
              <TableCell className="w-[154px] text-[13px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1B1B1B]">
                {member.approvalRequestDate || "-"}
              </TableCell>
              <TableCell className="w-[166px] text-[13px] font-medium leading-[1.193] tracking-[-0.025em] text-[#1B1B1B]">
                {statusLabels[member.certificationStatus]}
              </TableCell>
              <TableCell className="w-[124px]">
                <button
                  onClick={() => onViewDetails(member.id)}
                  className="h-[27.99px] px-[15px] bg-[#1B1B1B] text-white rounded text-[13px] font-semibold leading-[1.193] tracking-[-0.025em] hover:bg-[#2a2a2a] transition-colors"
                >
                  정보 조회
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
