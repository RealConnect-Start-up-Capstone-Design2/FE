export interface InquiryEntity {
  id: number;
  name: string | null;
  phone: string | null;
  inquiryType: string | null;
  apartmentName: string | null;
  area: string | null;
  salePrice: number | null;
  jeonsePrice: number | null;
  deposit: number | null;
  monthPrice: number | null;
  memo: string | null;
  status: string | null;
  createdAt: string | null;
  favorite: boolean;
}
