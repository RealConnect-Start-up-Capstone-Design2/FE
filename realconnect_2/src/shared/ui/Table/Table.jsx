import React from "react";
import styles from "./Table.module.css";

export const Table = ({
  columns,
  data,
  rowKey,
  selectedRowId,
  onRowClick,
  onRowSelect,
  selectedRows,
  isLoading = false,
  className = "",
  renderCell,
  emptyMessage = "데이터가 없습니다.",
}) => {
  const handleRowClick = (row, index) => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  const handleRowSelect = (row, checked) => {
    if (onRowSelect) {
      onRowSelect(row, checked);
    }
  };

  const selectedRowSet = React.useMemo(() => {
    if (!selectedRows || selectedRows.length === 0) {
      return new Set();
    }
    return new Set(selectedRows.map((value) => String(value)));
  }, [selectedRows]);

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (!data || data.length === 0) {
    return <div className={styles.commonTableEmpty}>{emptyMessage}</div>;
  }

  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      <table className={styles.commonTable}>
        <thead>
          <tr>
            {onRowSelect && (
              <th className={styles.checkboxColumn}>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    // 전체 선택/해제 로직
                    data.forEach((row) => {
                      onRowSelect(row, e.target.checked);
                    });
                  }}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.headerClassName}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const currentKey = rowKey ? rowKey(row) : row.id || index;
            const isSelected =
              // selectedRowId가 있고, 현재 행의 apartmentId와 일치하는지 확인
              selectedRowId != null &&
              String(selectedRowId) === String(row.apartmentId);
            const rowClassName = isSelected ? styles.selected : "";

            return (
              <tr
                key={currentKey}
                onClick={() => handleRowClick(row, index)}
                className={rowClassName}
                data-selected={isSelected ? "true" : undefined}
              >
                {onRowSelect && (
                  <td className={styles.checkboxColumn}>
                    <input
                      type="checkbox"
                      checked={
                        // apartmentId가 있고, 선택된 ID Set에 포함되는지 확인
                        row.apartmentId != null &&
                        selectedRowSet.has(String(row.apartmentId))
                      }
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRowSelect(row, e.target.checked);
                      }}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className={column.cellClassName || ""}>
                    {renderCell
                      ? renderCell(row, column, index)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
