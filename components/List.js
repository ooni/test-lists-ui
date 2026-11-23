import { flexRender } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getSortedRowModel,
  useLegacyTable as useReactTable,
} from '@tanstack/react-table/legacy'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  MdArrowDownward,
  MdArrowUpward,
  MdCheck,
  MdClose,
  MdDelete,
  MdEdit,
} from 'react-icons/md'
import { useIntl } from 'react-intl'
import { deleteRule, updateRule } from './lib/api'
import { useUser } from './lib/hooks'

const columnDefaults = {
  minSize: 0,
  size: 150,
  maxSize: Number.MAX_SAFE_INTEGER,
}

const columnStyle = (column) => ({
  boxSizing: 'border-box',
  width: column.getSize(),
  overflow: 'hidden',
})

const emptyRowState = { isEditing: false, dirty: false }

// Dynamic Cell renderer shows either raw value or an editable HTMLInput element when editing the row
const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue()
  const index = Number(row.id)
  const inputAttrs = column.columnDef.meta?.inputAttrs ?? {}
  const { updateCellData, getRowState, setRowState } = table.options.meta
  const { isEditing } = getRowState(index)
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  // Update table data onBlur and use row.values to send updates to API
  const onBlur = () => {
    let inputValue = value

    // Reformat values based on column type
    switch (inputAttrs.type) {
      case 'number':
        inputValue = Number(value)
        break
    }
    // Update table data only if value changes
    if (inputValue !== row.original[column.id]) {
      setRowState(index, (state) => ({ ...state, isEditing, dirty: true }))
      // TODO: This is not very optimal because it alters the table data before sending changes to the API.
      // Technically, this means that it is possible that, at times, table state doesn't reflect backend state.
      updateCellData(index, column.id, inputValue)
    }
  }

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (isEditing) {
    return (
      <input
        {...inputAttrs}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className='bg-white'
      />
    )
  }
  return value ?? ''
}

// Dynamic button
// * Starts editing a row
// * Switches to a two button component to confirm or cancel a row edit operation.
const EditButton = ({ row, table }) => {
  const index = Number(row.id)
  const { resetRow, onRowUpdate, getRowState, setRowState } = table.options.meta
  const { isEditing } = getRowState(index)

  const onEdit = useCallback(() => {
    // TODO: Don't edit if another row is still being edited
    setRowState(index, (state) => ({ ...state, isEditing: true }))
  }, [setRowState, index])

  const onCancel = useCallback(() => {
    // TODO: Ensure row state is reset before cancelling edit
    resetRow(index)
    setRowState(index, (state) => ({
      ...state,
      isEditing: false,
      dirty: false,
    }))
  }, [resetRow, index, setRowState])

  const onUpdate = useCallback(() => {
    const values = {
      category_code: row.original.category_code,
      cc: row.original.cc,
      domain: row.original.domain,
      url: row.original.url,
      priority: row.original.priority,
    }
    async function updateRow() {
      await onRowUpdate(index, values)
      setRowState(index, (state) => ({
        ...state,
        isEditing: false,
        dirty: false,
      }))
    }
    updateRow()
  }, [onRowUpdate, index, row.original, setRowState])

  return (
    <div className='flex flex-row justify-around'>
      {!isEditing && (
        <button type='button' className='icon-button mx-auto'>
          <MdEdit onClick={onEdit} size={20} />
        </button>
      )}
      {isEditing && (
        <>
          <button type='button' className='icon-button' title='Discard Changes'>
            <MdClose onClick={onCancel} size={20} />
          </button>
          <button type='button' className='icon-button' title='Apply Changes'>
            <MdCheck onClick={onUpdate} size={20} />
          </button>
        </>
      )}
    </div>
  )
}

const DeleteButton = ({ onClick }) => (
  <button type='button' className='icon-button' onClick={onClick}>
    <MdDelete size={18} />
  </button>
)

const TableSortLabel = ({ active = false, direction = 'desc', size = 16 }) =>
  active ? (
    direction === 'asc' ? (
      <MdArrowUpward size={size} />
    ) : (
      <MdArrowDownward size={size} />
    )
  ) : null

const List = ({ data, mutateRules }) => {
  const intl = useIntl()
  const [originalData, setOriginalData] = useState(data)
  const updateOriginalData = useCallback(() => setOriginalData(data), [data])
  const skipPageResetRef = useRef()
  const router = useRouter()

  const { user } = useUser()

  const isAdminUser = user?.role === 'admin'

  // biome-ignore lint/correctness/useExhaustiveDependencies: <ignore>
  const columns = useMemo(() => {
    const dataColumns = [
      {
        header: intl.formatMessage({ id: 'Prioritization.List.CategoryCode' }),
        accessorKey: 'category_code',
        size: 120,
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
        header: intl.formatMessage({ id: 'Prioritization.List.CountryCode' }),
        accessorKey: 'cc',
        size: 90,
        meta: {
          inputAttrs: {
            type: 'text',
            maxLength: 2,
            size: 4,
          },
        },
      },
      {
        header: intl.formatMessage({ id: 'Prioritization.List.Domain' }),
        accessorKey: 'domain',
        size: 180,
        meta: {
          inputAttrs: {
            type: 'url',
            size: 28,
          },
        },
      },
      {
        header: intl.formatMessage({ id: 'Changes.URL' }),
        accessorKey: 'url',
        meta: {
          inputAttrs: {
            type: 'url',
            size: 44,
          },
        },
      },
      {
        header: intl.formatMessage({ id: 'Prioritization.List.Priority' }),
        accessorKey: 'priority',
        size: 100,
        meta: {
          inputAttrs: {
            type: 'number',
            maxLength: 2,
            min: 0,
            size: 6,
          },
        },
      },
    ]

    if (!isAdminUser) return dataColumns

    return [
      {
        id: 'edit',
        size: 56,
        maxSize: 56,
        enableSorting: false,
        cell: EditButton,
      },
      ...dataColumns,
      {
        id: 'delete',
        size: 48,
        maxSize: 48,
        enableSorting: false,
        cell: ({ row, table }) => (
          <DeleteButton
            onClick={() => table.options.meta.onRowDelete(Number(row.id))}
          />
        ),
      },
    ]
  }, [isAdminUser])

  // Called whenever a cell is changed so that the table data
  // and controlled inputs are in sync
  const updateCellData = useCallback(
    (rowIndex, columnId, value) => {
      skipPageResetRef.current = true
      const locallyChangedData = data.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...data[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
      console.debug('locallyChanged row:', locallyChangedData[0])
      // Update local swr cache, but do not fetch fresh data because editing must be in progress
      mutateRules(locallyChangedData, false)
    },
    [data, mutateRules],
  )

  // Called to reverse the changes by updateCellData for the whole row
  // based on data stored in originalData received from API
  const resetRow = useCallback(
    (rowIndex) => {
      console.debug('Restoring to: ', originalData[rowIndex])
      skipPageResetRef.current = true
      const restoredData = originalData.map((row, index) => {
        if (index === rowIndex) {
          return originalData[rowIndex]
        }
        return row
      })
      // Restore local swr cache, but also fetch fresh data
      mutateRules(restoredData, false)
    },
    [originalData, mutateRules],
  )

  const onRowUpdate = useCallback(
    (rowIndex, updatedEntry) => {
      if (rowIndex in originalData) {
        return updateRule(originalData[rowIndex], updatedEntry)
          .then(async () => {
            try {
              await mutateRules(data, true)
              updateOriginalData()
            } catch (e) {
              console.error(
                'Failed to mutate after successful update. Table state could be broken. Reloading page.',
              )
              router.reload()
            }
          })
          .catch((e) => {
            // TODO: Update failed. Now what?
            console.log(e?.response?.data?.error)
            router.reload()
          })
      }
    },
    [originalData, mutateRules, data, updateOriginalData, router],
  )

  // TODO: Maybe this can be merged with onRowUpdate
  const onRowDelete = useCallback(
    (rowIndex) => {
      if (rowIndex in originalData) {
        return deleteRule(originalData[rowIndex])
          .then(async () => {
            try {
              await mutateRules(
                originalData.filter((_, i) => i !== rowIndex),
                true,
              )
              updateOriginalData()
            } catch (e) {
              console.error(
                'Failed to mutate after successful delete. Table state could be broken. Reloading page.',
              )
              router.reload()
            }
          })
          .catch((e) => {
            console.log(e?.response?.data?.error)
            router.reload()
          })
      }
    },
    [mutateRules, originalData, router, updateOriginalData],
  )

  const [sorting, setSorting] = useState([{ id: 'priority', desc: true }])
  const [rowState, setRowStateMap] = useState({})
  const [dataForReset, setDataForReset] = useState(data)

  // Local edits set skipPageResetRef first. Other data changes restore the
  // initial priority sort and clear per-row editing state.
  if (data !== dataForReset) {
    setDataForReset(data)
    if (!skipPageResetRef.current) {
      setSorting([{ id: 'priority', desc: true }])
      setRowStateMap({})
    }
  }

  // Clear the flag after the render that consumed it.
  useEffect(() => {
    skipPageResetRef.current = false
  })

  const getRowState = useCallback(
    (index) => rowState[index] ?? emptyRowState,
    [rowState],
  )

  const setRowState = useCallback((index, updater) => {
    setRowStateMap((current) => {
      const previous = current[index] ?? emptyRowState
      const next = typeof updater === 'function' ? updater(previous) : updater
      return { ...current, [index]: next }
    })
  }, [])

  const table = useReactTable({
    data,
    columns,
    defaultColumn: { ...columnDefaults, cell: EditableCell },
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (_row, index) => String(index),
    meta: {
      updateCellData,
      onRowUpdate,
      onRowDelete,
      resetRow,
      getRowState,
      setRowState,
    },
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
                className='data-table-cell'
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

export default List
