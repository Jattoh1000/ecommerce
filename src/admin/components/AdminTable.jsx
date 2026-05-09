// src/admin/components/AdminTable.jsx
import React, { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMoreVertical,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiFilter,
  FiDownload,
  FiUpload,
  FiRefreshCw,
} from "react-icons/fi";
import Pagination from "../../components/Pagination";
import { ButtonSpinner } from "../../components/LoadingSkeleton";

const AdminTable = ({
  title = "Data Table",
  columns = [],
  data = [],
  loading = false,
  totalItems = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onSearch,
  onSort,
  onFilter,
  onEdit,
  onDelete,
  onView,
  actions = true,
  searchable = true,
  sortable = true,
  selectable = false,
  exportable = false,
  addButton = null,
  emptyMessage = "No data found",
  itemsPerPage = 10,
  customActions = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch && onSearch(value);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    onSort && onSort(key, direction);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const toggleActionMenu = (id) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  // Close action menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenActionId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      id="admin_table_container"
      name_id="admin_table_container"
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
    >
      {/* Table Header */}
      <div
        id="admin_table_header"
        name_id="admin_table_header"
        className="p-6 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h2
              id="admin_table_title"
              name_id="admin_table_title"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              {title}
            </h2>
            {totalItems > 0 && (
              <span
                id="admin_table_count"
                name_id="admin_table_count"
                className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full font-medium"
              >
                {totalItems} total
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Search */}
            {searchable && (
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="table_search_input"
                  name_id="table_search_input"
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm w-full sm:w-64"
                />
              </div>
            )}

            {/* Filter Button */}
            {onFilter && (
              <button
                onClick={onFilter}
                id="table_filter_button"
                name_id="table_filter_button"
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Filter"
              >
                <FiFilter className="w-5 h-5" />
              </button>
            )}

            {/* Export Button */}
            {exportable && (
              <button
                id="table_export_button"
                name_id="table_export_button"
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Export"
              >
                <FiDownload className="w-5 h-5" />
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={() => onSearch && onSearch(searchTerm)}
              id="table_refresh_button"
              name_id="table_refresh_button"
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Refresh"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>

            {/* Add Button */}
            {addButton && <div>{addButton}</div>}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectable && selectedRows.length > 0 && (
          <div
            id="table_bulk_actions"
            name_id="table_bulk_actions"
            className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-between"
          >
            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              {selectedRows.length} item(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                id="bulk_delete_button"
                name_id="bulk_delete_button"
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Selected
              </button>
              <button
                id="bulk_clear_button"
                name_id="bulk_clear_button"
                onClick={() => setSelectedRows([])}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table
          id="admin_data_table"
          name_id="admin_data_table"
          className="w-full"
        >
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              {/* Checkbox Column */}
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    id="select_all_checkbox"
                    name_id="select_all_checkbox"
                    checked={
                      selectedRows.length === data.length && data.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}

              {/* Data Columns */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  id={`table_header_${column.key}`}
                  name_id={`table_header_${column.key}`}
                  className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {sortable && column.sortable !== false ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      id={`sort_button_${column.key}`}
                      name_id={`sort_button_${column.key}`}
                      className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors group"
                    >
                      <span>{column.label}</span>
                      <span className="flex flex-col">
                        <FiChevronUp
                          className={`w-3 h-3 -mb-1 ${
                            sortConfig.key === column.key &&
                            sortConfig.direction === "asc"
                              ? "text-primary-600 dark:text-primary-400"
                              : "text-gray-400"
                          }`}
                        />
                        <FiChevronDown
                          className={`w-3 h-3 ${
                            sortConfig.key === column.key &&
                            sortConfig.direction === "desc"
                              ? "text-primary-600 dark:text-primary-400"
                              : "text-gray-400"
                          }`}
                        />
                      </span>
                    </button>
                  ) : (
                    <span>{column.label}</span>
                  )}
                </th>
              ))}

              {/* Actions Column */}
              {actions && (
                <th
                  id="table_header_actions"
                  name_id="table_header_actions"
                  className="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Loading State */}
            {loading ? (
              [...Array(itemsPerPage)].map((_, index) => (
                <tr key={`skeleton_${index}`}>
                  {selectable && (
                    <td className="px-4 py-4">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-4">
                      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto" />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length > 0 ? (
              /* Data Rows */
              data.map((item, index) => (
                <tr
                  key={item.id || index}
                  id={`table_row_${item.id || index}`}
                  name_id={`table_row_${item.id || index}`}
                  className={`
                    hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                    ${selectedRows.includes(item.id) ? "bg-primary-50 dark:bg-primary-900/10" : ""}
                  `}
                >
                  {/* Checkbox */}
                  {selectable && (
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        id={`select_row_${item.id}`}
                        name_id={`select_row_${item.id}`}
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                  )}

                  {/* Data Cells */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      id={`table_cell_${item.id}_${column.key}`}
                      name_id={`table_cell_${item.id}_${column.key}`}
                      className="px-4 py-4"
                    >
                      {column.render ? (
                        column.render(item[column.key], item)
                      ) : (
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item[column.key]}
                        </span>
                      )}
                    </td>
                  ))}

                  {/* Actions Dropdown */}
                  {actions && (
                    <td className="px-4 py-4 text-right relative">
                      <div className="flex items-center justify-end space-x-1">
                        {/* Quick View Button */}
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            id={`view_button_${item.id}`}
                            name_id={`view_button_${item.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        )}

                        {/* Quick Edit Button */}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            id={`edit_button_${item.id}`}
                            name_id={`edit_button_${item.id}`}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* More Actions Dropdown */}
                        {customActions && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleActionMenu(item.id);
                              }}
                              id={`more_actions_button_${item.id}`}
                              name_id={`more_actions_button_${item.id}`}
                              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <FiMoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {openActionId === item.id && (
                              <div
                                id={`action_dropdown_${item.id}`}
                                name_id={`action_dropdown_${item.id}`}
                                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-fade-in"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {customActions.map((action, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      action.onClick(item);
                                      setOpenActionId(null);
                                    }}
                                    id={`action_${action.label.toLowerCase()}_${item.id}`}
                                    name_id={`action_${action.label.toLowerCase()}_${item.id}`}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                                  >
                                    {action.icon && (
                                      <action.icon className="w-4 h-4" />
                                    )}
                                    <span>{action.label}</span>
                                  </button>
                                ))}

                                {/* Delete Action */}
                                {onDelete && (
                                  <>
                                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                                    <button
                                      onClick={() => {
                                        onDelete(item);
                                        setOpenActionId(null);
                                      }}
                                      id={`delete_action_${item.id}`}
                                      name_id={`delete_action_${item.id}`}
                                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
                                    >
                                      <FiTrash2 className="w-4 h-4" />
                                      <span>Delete</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Simple Delete Button (if no custom actions) */}
                        {onDelete && !customActions && (
                          <button
                            onClick={() => onDelete(item)}
                            id={`delete_button_${item.id}`}
                            name_id={`delete_button_${item.id}`}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              /* Empty State */
              <tr>
                <td
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)
                  }
                  className="px-4 py-16 text-center"
                >
                  <div
                    id="table_empty_state"
                    name_id="table_empty_state"
                    className="flex flex-col items-center"
                  >
                    <FiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-1">
                      {emptyMessage}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      Try adjusting your search or filter to find what you're
                      looking for.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div
        id="admin_table_footer"
        name_id="admin_table_footer"
        className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          results
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AdminTable;
