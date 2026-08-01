import React from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export function DataTable({
  columns = [],
  data = [],
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  filters = [],
  onExport,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No records found in database.'
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-dark-section overflow-hidden flex flex-col shadow-xl">
      {/* ── Toolbar ── */}
      <div className="p-4 border-b border-white/[0.08] bg-dark-shell/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-txt-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs dark-input rounded-xl focus:outline-none"
            />
          </div>

          {/* Filters */}
          {filters.map((f, i) => (
            <div key={i} className="hidden md:block relative">
              <select
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="pl-3 pr-8 py-2 text-xs dark-input rounded-xl appearance-none cursor-pointer text-txt-secondary"
              >
                <option value="" className="bg-dark-shell text-txt-primary">All {f.label}s</option>
                {f.options.map(opt => (
                  <option key={opt} value={opt} className="bg-dark-shell text-txt-primary">{opt}</option>
                ))}
              </select>
              <Filter className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-txt-muted pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Export */}
        {onExport && (
          <button
            onClick={onExport}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-txt-secondary bg-dark-card hover:bg-dark-hover border border-white/[0.08] rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-accent-emerald" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* ── Data Grid ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-dark-shell border-b border-white/[0.08] text-txt-muted font-bold uppercase tracking-wider">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={`px-4 py-3 text.txt-muted ${col.className || ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] bg-dark-section">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-txt-muted">
                  <div className="animate-pulse">Loading records from PostgreSQL...</div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-txt-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors border-b border-white/[0.04] ${
                    rowIndex % 2 === 0 ? 'bg-dark-section' : 'bg-dark-shell/30'
                  } ${onRowClick ? 'cursor-pointer hover:bg-dark-hover' : ''}`}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`px-4 py-3 ${col.tdClassName || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {!isLoading && data.length > 0 && (
        <div className="p-3 border-t border-white/[0.08] flex items-center justify-between bg-dark-shell/40">
          <span className="text-[10px] font-semibold text-txt-muted">
            Showing <span className="text-txt-primary">1</span> to <span className="text-txt-primary">{data.length}</span> of <span className="text-txt-primary">{data.length}</span> records
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded text-txt-muted hover:text-txt-primary hover:bg-dark-hover disabled:opacity-40" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded text-txt-muted hover:text-txt-primary hover:bg-dark-hover disabled:opacity-40" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
