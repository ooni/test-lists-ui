import { flexRender } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getSortedRowModel,
  useLegacyTable as useReactTable,
} from '@tanstack/react-table/legacy'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {
  MdArrowDownward,
  MdArrowUpward,
  MdDelete,
  MdEdit,
} from 'react-icons/md'
import { useIntl } from 'react-intl'
import categories from '../lib/category_codes.json'

const defaultColumn = {
  minSize: 0,
  size: 150,
  maxSize: Number.MAX_SAFE_INTEGER,
}

const columnStyle = (column) => ({
  boxSizing: 'border-box',
  width: column.getSize(),
  overflow: 'hidden',
})

const EditButton = ({ row: { index }, onEdit }) => {
  const editRow = useCallback(() => {
    onEdit(index)
  }, [onEdit, index])

  return (
    <button type='button' className='icon-button mx-auto' title='Edit'>
      <MdEdit onClick={editRow} size={20} />
    </button>
  )
}

const DeleteButton = ({ row: { index }, onDelete }) => {
  const deleteRow = useCallback(() => {
    onDelete(index)
  }, [onDelete, index])

  return (
    <button
      type='button'
      className='icon-button'
      title='Delete'
      onClick={deleteRow}
    >
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

const CategoryCell = memo(({ getValue }) => {
  const value = getValue()
  return (
    value in categories && (
      <>
        {categories[value][0]}
        <span
          className='absolute -mt-1.5 cursor-help text-base'
          title={categories[value][1]}
        >
          ℹ
        </span>
      </>
    )
  )
})

CategoryCell.displayName = 'CategoryCell'

const DateCell = memo(({ getValue }) => {
  const value = getValue()
  try {
    const date = new Date(value)
    const formattedDate = new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
    }).format(date)
    return formattedDate
  } catch (e) {
    console.error(`Cannot parse date: ${value}`, e.message)
    return ''
  }
})
DateCell.displayName = 'DateCell'

const TableView = ({ data, onEdit, onDelete, isEditingRef }) => {
  const { formatMessage } = useIntl()
  const [sorting, setSorting] = useState([])
  // biome-ignore lint/correctness/useExhaustiveDependencies: <ignore>
  const columns = useMemo(
    () => [
      {
        header: formatMessage({ id: 'Changes.URL' }),
        accessorKey: 'url',
        minSize: 100,
        meta: {
          inputAttrs: {
            type: 'url',
            size: 44,
          },
        },
      },
      {
        header: formatMessage({ id: 'Changes.Category' }),
        accessorKey: 'category_code',
        id: 'category_code',
        cell: CategoryCell,
        size: 160,
        meta: {
          inputAttrs: {
            type: 'text',
            maxLength: 5,
            size: 10,
            id: 'category_code',
          },
        },
      },
      {
        header: formatMessage({ id: 'Changes.DateAdded' }),
        accessorKey: 'date_added',
        size: 150,
        cell: DateCell,
        meta: { className: 'secondary' },
      },
      {
        header: formatMessage({ id: 'Changes.Source' }),
        accessorKey: 'source',
        size: 140,
        meta: { className: 'secondary' },
      },
      {
        header: formatMessage({ id: 'Changes.Notes' }),
        accessorKey: 'notes',
        minSize: 100,
        meta: {
          className: 'secondary',
          inputAttrs: {
            type: 'text',
            maxLength: 20,
            size: 32,
          },
        },
      },
      {
        id: 'edit',
        size: 48,
        maxSize: 48,
        enableSorting: false,
        cell: ({ row, table }) => (
          <EditButton
            row={{ index: Number(row.id) }}
            onEdit={table.options.meta.onEdit}
          />
        ),
      },
      {
        id: 'delete',
        size: 48,
        maxSize: 48,
        enableSorting: false,
        cell: ({ row, table }) => (
          <DeleteButton
            row={{ index: Number(row.id) }}
            onDelete={table.options.meta.onDelete}
          />
        ),
      },
    ],
    [],
  )

  // Keep sort through the render that receives a refreshed list, then allow
  // the next refresh to reset it. Opening the modal does not change `data`.
  useEffect(() => {
    if (!data) return
    if (!isEditingRef.current) {
      setSorting((current) => (current.length ? [] : current))
    }
    isEditingRef.current = false
  }, [data, isEditingRef])

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (_row, index) => String(index),
    meta: { onEdit, onDelete },
  })

  const totalSize = table.getTotalSize()

  return (
    <table
      className='data-table'
      style={{ width: totalSize, minWidth: '100%', tableLayout: 'fixed' }}
    >
      <thead className='data-table-header'>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const sorted = header.column.getIsSorted()
              return (
                <th
                  key={header.id}
                  className={header.column.columnDef.meta?.className}
                  style={columnStyle(header.column)}
                  onClick={
                    header.column.getCanSort()
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                >
                  <span className='flex items-center'>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    <TableSortLabel
                      active={!!sorted}
                      direction={sorted === 'asc' ? 'asc' : 'desc'}
                    />
                  </span>
                </th>
              )
            })}
          </tr>
        ))}
      </thead>

      <tbody className='text-sm'>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className='data-table-row'>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={`data-table-cell ${cell.column.columnDef.meta?.className ?? ''}`}
                style={columnStyle(cell.column)}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default memo(TableView)
