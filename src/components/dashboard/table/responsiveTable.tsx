import React from "react";
import {
  lessThan,
  greaterThan,
} from "../../../../public/assets/svgIcons/svgIcons";

interface Column {
  label: string;
  accessor: string;
  render?: (data: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const Table: React.FC<TableProps> = ({ columns, data, pagination }) => {
  return (
    <div className="bg-white rounded-lg ml-0 sm:-ml-15 sm:w-full">
      <div className="hidden md:block overflow-x-auto mx-6 relative">
        <div className="max-h-[700px] overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse table-fixed">
            <thead className="bg-[#F9F9F9] sticky top-0 z-10">
              <tr className="bg-lynx-grey-1700 text-left">
                {columns.map((column) => (
                  <th
                    key={column.accessor}
                    className="px-2 py-3 font-medium text-sm text-lynx-blue-400 w-[215px] "
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              {data?.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b last:border-0">
                  {columns.map((column) => (
                    <td
                      key={column.accessor}
                      className="px-2 py-6 text-sm text-gray-700  overflow-hidden text-ellipsis"
                      title={
                        typeof row[column.accessor] === "string"
                          ? row[column.accessor]
                          : ""
                      }
                    >
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="items-center justify-center py-4 hidden md:flex">
          <button
            onClick={() =>
              pagination.onPageChange(pagination.currentPage - 1)
            }
            disabled={pagination.currentPage === 1}
            className={`px-2 py-1 mx-1 text-gray-600 rounded ${
              pagination.currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
            aria-label="Go to previous page"
          >
            {lessThan}
          </button>
          {Array.from({ length: pagination.totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => pagination.onPageChange(index + 1)}
              className={`px-3 py-1 mx-1 rounded ${
                pagination.currentPage === index + 1
                  ? "bg-lynx-grey-1500 text-black"
                  : "text-lynx-grey-1100 hover:bg-lynx-grey-1500"
              }`}
              aria-label={`Go to page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              pagination.onPageChange(pagination.currentPage + 1)
            }
            disabled={pagination.currentPage === pagination.totalPages}
            className={`px-2 py-1 mx-1 text-gray-600 rounded ${
              pagination.currentPage === pagination.totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
            aria-label="Go to next page"
          >
            {greaterThan}
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
