import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SkeletonTable } from './SkeletonLoader';
import EmptyState from './EmptyState';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage,
}) => {
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  if (loading) {
    return <SkeletonTable />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={t('noDataAvailable')}
        description={emptyMessage || t('noRecordsFound')}
      />
    );
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto shadow-2xl rounded-2xl bg-[#1B2028] border border-[#323A46]">
        <table className="w-full text-left text-sm font-body text-[#DFE6EF]">
          <thead className="bg-[#11141A] border-b border-[#323A46] text-[#DFE6EF] font-heading">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`p-4 text-xs font-bold uppercase tracking-wider text-[#7E8A99] ${col.sortable ? 'cursor-pointer hover:text-[#DFE6EF]' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <span className="flex flex-col">
                        <ChevronUp
                          size={12}
                          className={`${
                            sortKey === col.key && sortDirection === 'asc'
                              ? 'text-[#38BDF8]'
                              : 'text-[#7E8A99]/50'
                          } -mb-1`}
                        />
                        <ChevronDown
                          size={12}
                          className={`${
                            sortKey === col.key && sortDirection === 'desc'
                              ? 'text-[#38BDF8]'
                              : 'text-[#7E8A99]/50'
                          }`}
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#323A46]/60">
            {sortedData.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-[#323A46]/20 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="p-4 text-sm text-[#DFE6EF]">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {sortedData.map((row, i) => (
          <div key={i} className="card p-4 space-y-2 bg-[#1B2028] border border-[#323A46] rounded-2xl shadow-md">
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-center py-1 border-b border-[#323A46]/40 last:border-0">
                <span className="text-xs font-heading font-bold text-[#7E8A99]">
                  {col.label}
                </span>
                <span className="text-sm font-body font-medium text-[#DFE6EF]">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataTable;
