import React from "react";
import styles from "./table.module.css";
/**
 * columns: [{ key, header, render? }]
 * data: array of row objects
 * loading: boolean
 * emptyMessage: string
 */
const Table = ({
  columns,
  data,
  loading,
  emptyMessage,
  onRowClick,
  rowClassName,
  observerRef,
}) => (
  <div className={styles.tableWrapper}>
    <table className={styles.commonTable}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={
                col.key === "checkbox" ? styles.checkboxColumn : undefined
              }
              style={col.key === "checkbox" ? { width: "2.667rem" } : undefined}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length}>로딩 중...</td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={columns.length}>{emptyMessage || "데이터 없음"}</td>
          </tr>
        ) : (
          <>
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                className={rowClassName}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={{ cursor: onRowClick ? "pointer" : undefined }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={
                      col.key === "checkbox" ? styles.checkboxColumn : undefined
                    }
                    style={
                      col.key === "checkbox" ? { width: "2.667rem" } : undefined
                    }
                  >
                    {col.render ? col.render(row, i) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {/* Intersection Observer를 위한 마지막 행 */}
            {observerRef && (
              <tr>
                <td
                  colSpan={columns.length}
                  ref={observerRef}
                  style={{ height: "1px", padding: 0 }}
                />
              </tr>
            )}
          </>
        )}
      </tbody>
    </table>
  </div>
);

export default Table;
