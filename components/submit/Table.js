import React, { useCallback, useMemo } from 'react'
import {
  MdArrowDownward,
  MdArrowUpward,
  MdDelete,
  MdEdit,
} from 'react-icons/md'
import { useFlexLayout, useSortBy, useTable } from 'react-table'

import { useIntl } from 'react-intl'
import categories from '../lib/category_codes.json'

const EditButton = ({ row: { index }, onEdit, submissionState }) => {
  const editRow = useCallback(() => {
    onEdit(index)
  }, [onEdit, index])

  return (
    <button type="button" className="icon-button mx-auto" title='Edit'>
      <MdEdit onClick={editRow} size={20} />
    </button>
  )
}

const DeleteButton = ({ row: { index }, onDelete, submissionState }) => {
  const deleteRow = useCallback(() => {
    onDelete(index)
  }, [onDelete, index])

  return (
    <button type="button" className="icon-button" title='Delete' onClick={deleteRow}>
      <MdDelete size={18} />
    </button>
  )
}

const TableSortLabel = ({ active = false, direction = 'desc', size = 16 }) =>
  active ? (
    direction === 'asc' ? (
      <MdArrowUpward size={size} />
    ) : (
      <MdArrowDownward size={size} />
    )
  ) : null

const CategoryCell = React.memo(
  ({ cell: { value } }) =>
    value in categories && (
      <>
        {categories[value][0]}
        <span
          className="absolute -mt-1.5 cursor-help text-base"
          title={categories[value][1]}
        >
          ℹ
        </span>
      </>
    ),
)

CategoryCell.displayName = 'CategoryCell'

const DateCell = React.memo(({ cell: { value } }) => {
  try {
    const date = new Date(value)
    const formattedDate = new Intl.DateTimeFormat([], {
      dateStyle: 'medium',
    }).format(date)
    return formattedDate
  } catch (e) {
    console.error(`Cannot parse date: ${value}`, e.message)
    return ''
  }
})
DateCell.displayName = 'DateCell'

const TableView = ({
  data,
  onEdit,
  onDelete,
  skipPageReset,
  submissionState,
}) => {
  const { formatMessage } = useIntl()
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'Changes.URL' }),
        accessor: 'url',
        minWidth: 100,
        inputAttrs: {
          type: 'url',
          size: 44,
        },
        cell: ({ cell }) => <bdo dir='ltr'>{cell.original.domain}</bdo>,
      },
      {
        Header: formatMessage({ id: 'Changes.Category' }),
        accessor: 'category_code',
        id: 'category_code',
        Cell: CategoryCell,
        width: 50,
        inputAttrs: {
          type: 'text',
          maxLength: 5,
          size: 10,
          id: 'category_code',
        },
      },
      {
        Header: formatMessage({ id: 'Changes.DateAdded' }),
        accessor: 'date_added',
        maxWidth: 40,
        Cell: DateCell,
        className: 'secondary',
      },
      {
        Header: formatMessage({ id: 'Changes.Source' }),
        accessor: 'source',
        maxWidth: 40,
        className: 'secondary',
      },
      {
        Header: formatMessage({ id: 'Changes.Notes' }),
        accessor: 'notes',
        minWidth: 100,
        inputAttrs: {
          type: 'text',
          maxLength: 20,
          size: 32,
        },
        className: 'secondary',
      },
    ],
    [],
  )

  const tableInstance = useTable(
    {
      columns,
      data,
      onEdit,
      onDelete,
      submissionState,
      autoResetSortBy: !skipPageReset,
    },
    useFlexLayout,
    useSortBy,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        ...columns,
        {
          id: 'edit',
          maxWidth: 16,
          Cell: EditButton,
        },
        {
          id: 'delete',
          maxWidth: 16,
          Cell: DeleteButton,
        },
      ])
    },
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  const { className: tableClassName, ...tableProps } = getTableProps()

  return (
    <table className={`data-table ${tableClassName ?? ''}`} {...tableProps}>
      <thead className="data-table-header">
        {headerGroups.map((headerGroup) => {
          const { key: headerGroupKey, ...headerGroupProps } =
            headerGroup.getHeaderGroupProps()
          return (
            <tr key={headerGroupKey} {...headerGroupProps}>
              {headerGroup.headers.map((column) => {
                const { key: headerKey, ...headerProps } =
                  column.getHeaderProps([
                    column.getSortByToggleProps(),
                    { className: column.className },
                  ])
                return (
                  <th key={headerKey} {...headerProps}>
                    {column.render('Header')}
                    <TableSortLabel
                      active={column.isSorted}
                      direction={column.isSortedDesc ? 'desc' : 'asc'}
                    />
                  </th>
                )
              })}
            </tr>
          )
        })}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          const { key: rowKey, ...rowProps } = row.getRowProps()
          return (
            <tr key={rowKey} className="data-table-row" {...rowProps}>
              {row.cells.map((cell) => {
                const { key: cellKey, className: cellClassName, ...cellProps } =
                  cell.getCellProps([{ className: cell.column.className }])
                return (
                  <td
                    key={cellKey}
                    className={`data-table-cell ${cellClassName ?? ''}`}
                    {...cellProps}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default TableView
