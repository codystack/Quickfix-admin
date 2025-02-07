import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { BsThreeDots } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TextField } from "@mui/material";
import "./paginate.css";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface Column {
  key: string;
  label: string;
}

interface Action {
  label: string;
  className: string;
  onClick: (item: any) => void;
}

interface CheckTableProps {
  columns: Column[];
  data: Array<{ [key: string]: any }>;
  actions?: Action[];
  itemsPerPage?: number;
}

const CheckTable: React.FC<CheckTableProps> = ({
  columns,
  data,
  actions,
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const offset = currentPage * itemsPerPage;
  const currentData = filteredData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    let updatedData = [...data];

    // Apply search filter
    if (searchQuery) {
      updatedData = updatedData.filter((item) =>
        Object.values(item).some((val) =>
          val.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply date range filter
    if (startDate && endDate) {
      updatedData = updatedData.filter((item) => {
        const itemDate = new Date(item.date); // Assuming `date` field exists in the item
        return itemDate >= startDate && itemDate <= endDate;
      });
    } else if (startDate) {
      updatedData = updatedData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate;
      });
    } else if (endDate) {
      updatedData = updatedData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate <= endDate;
      });
    }

    setFilteredData(updatedData);
  }, [searchQuery, startDate, endDate, data]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  const handleRowCheck = (itemId: number) => {
    if (selectedRows.includes(itemId)) {
      setSelectedRows(selectedRows.filter((id) => id !== itemId));
    } else {
      setSelectedRows([...selectedRows, itemId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const pageItemIds = currentData.map((item) => item.id);
      setSelectedRows(pageItemIds);
    }
    setSelectAll(!selectAll);
  };

  const toggleMenu = (id: string) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {/* Search Bar */}
      <div className="flex lg:flex-row sm:flex-col items-center justify-between lg:p-5 sm:p-2">
        <div className="w-[30%]">
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left mt-5">
        <thead className="capitalize bg-gray-200 rounded-lg">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 capitalize ">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3 capitalize ">action</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center py-4"
              >
                No Data Available
              </td>
            </tr>
          ) : (
            currentData.map((item) => (
              <tr
                key={item.id}
                className={`bg-white capitalize ${
                  selectedRows.includes(item.id) ? "bg-gray-100" : ""
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleRowCheck(item.id)}
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {item[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="relative px-6 py-4">
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className="text-gray-500 cursor-pointer hover:text-gray-700"
                    >
                      <BsThreeDots size={20} />
                    </button>
                    {activeMenu === item.id && (
                      <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-md top-10 right-0 w-40">
                        {actions.map((action, idx) => (
                          <button
                            key={idx}
                            className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${action.className}`}
                            onClick={() => {
                              action.onClick(item);
                              setActiveMenu(null);
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="paginate flex items-center justify-end p-3 text-gray-400 gap-x-4">
        {/* Items Range Display */}
        <span className="text-lg ">
          {filteredData.length === 0
            ? "0"
            : `${offset + 1}-${Math.min(offset + itemsPerPage, filteredData.length)}   `} 
          of {pageCount}
        </span>

        {/* Pagination Component */}
        <ReactPaginate
          breakLabel="..."
          previousLabel={<MdKeyboardArrowLeft size={30} />}
          nextLabel={<MdKeyboardArrowRight size={30} />}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName="pagination flex items-center gap-x-2"
          pageClassName="page-item hidden"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          activeClassName="active"
        />
      </div>

    </div>
  );
};


export default CheckTable;
