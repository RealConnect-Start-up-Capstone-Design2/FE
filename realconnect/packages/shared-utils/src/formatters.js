/**
 * 가격을 만원/억 단위의 문자열로 포맷팅합니다.
 * 1억 이상은 소수점 둘째 자리까지 표시합니다. (예: 1.23억)
 * 1억 미만은 만원 단위로 표시합니다. (예: 5,000만원)
 * @param {number | string | null | undefined} price - 원 단위의 가격
 * @returns {string} 포맷팅된 가격 문자열 또는 "-"
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || price === "" || price === "-") {
    return "-";
  }

  // 쉼표 등 숫자가 아닌 문자 제거
  const numPrice = Number(String(price).replace(/,/g, ""));

  if (isNaN(numPrice) || numPrice === 0) {
    return "-";
  }

  if (numPrice >= 100000000) {
    // 1억 이상
    const eok = numPrice / 100000000;
    return `${eok.toFixed(1)}억`;
  } else {
    // 1억 미만
    const man = Math.floor(numPrice / 10000);
    return `${man.toLocaleString()}만원`;
  }
};

/**
 * 날짜 문자열이나 Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환합니다.
 * @param {string | Date | null | undefined} dateString - 변환할 날짜
 * @returns {string} 'YYYY-MM-DD' 형식의 문자열 또는 "-"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    // 유효하지 않은 날짜(Invalid Date)인지 확인
    if (isNaN(date.getTime())) return "-";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (error) {
    // new Date()에서 에러가 발생하는 경우 (예: 잘못된 형식)
    return "-";
  }
};
