import { useRouter } from 'next/router'
import { Flex, theme } from 'ooni-components'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  MdArrowDownward,
  MdArrowUpward,
  MdCheck,
  MdClose,
  MdDelete,
  MdEdit,
} from 'react-icons/md'
import {
  defaultRenderer as Cell,
  useFlexLayout,
  useRowState,
  useSortBy,
  useTable,
} from 'react-table'
import styled from 'styled-components'
import { deleteRule, updateRule } from './lib/api'
import { useUser } from './lib/hooks'

const BORDER_COLOR = theme.colors.gray6
const ODD_ROW_BG = theme.colors.gray2
const EVEN_ROW_BG = theme.colors.gray0

const Table = styled.table`
  width: 100%;
`

const TableHeader = styled.thead`
  background-color: white;
  & th {
    display: flex;
    align-items: center;
    text-align: start;
    padding: 12px;
  }
`

const TableRow = styled.tr`
  &:nth-child(odd) {
    background-color: ${ODD_ROW_BG};
  }
  &:nth-child(even) {
    background-color: ${EVEN_ROW_BG};
  }
  &:first-child {
    border-top: 1px solid ${BORDER_COLOR};
  }
  &:last-child {
    border-bottom: 1px solid ${(props) => props.theme.colors.gray6};
  }
`

const TableCell = styled.td`
  margin: 0;
  padding: 0.5rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray6};

  &:last-child {
    border-right: 1px solid ${(props) => props.theme.colors.gray6};
  }
  &:first-child {
    border-left: 1px solid ${(props) => props.theme.colors.gray6};
  }

  input {
    font-size: 1rem;
    padding: 0;
    margin: 0;
    border: 0;
  }
  /* TODO: Input validation styling */
`

// Dynamic Cell renderer shows either raw value or an editable HTMLInput element when editing the row
const EditableCell = ({
  value: initialValue,
  row: {
    index,
    original,
    state: { isEditing },
    setState,
  },
  column: { id, inputAttrs = {} },
  updateCellData,
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

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
    if (inputValue !== original[id]) {
      setState({ isEditing, dirty: true })
      // TODO: This is not very optimal because it alters the table data before sending changes to the API.
      // Technically, this means that it is possible that, at times, table state doesn't reflect backend state.
      updateCellData(index, id, inputValue)
    }
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (isEditing) {
    return (
      <input
        {...inputAttrs}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    )
  }
  return <Cell value={value} />
}

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
}

const Button = styled.button`
  background-color: transparent;
  border: 0;
  padding: 0;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')}
`

// Dynamic button
// * Starts editing a row
// * Switches to a two button component to confirm or cancel a row edit operation.
const EditButton = ({
  resetRow,
  onRowUpdate,
  row: {
    index,
    values,
    state: { isEditing, dirty },
    setState,
  },
}) => {
  const onEdit = useCallback(() => {
    // TODO: Don't edit if another row is still being edited
    setState((state) => ({ ...state, isEditing: true }))
  }, [setState])

  const onCancel = useCallback(() => {
    // TODO: Ensure row state is reset before cancelling edit
    resetRow(index)
    setState((state) => ({ ...state, isEditing: false, dirty: false }))
  }, [resetRow, index, setState])

  const onUpdate = useCallback(() => {
    async function updateRow() {
      await onRowUpdate(index, values)
      setState((state) => ({ ...state, isEditing: false, dirty: false }))
    }
    updateRow()
  }, [onRowUpdate, index, values, setState])

  return (
    <Flex flexDirection='row' justifyContent='space-around'>
      {!isEditing && (
        <Button mx='auto'>
          <MdEdit onClick={onEdit} size={20} />
        </Button>
      )}
      {isEditing && (
        <>
          <Button title='Discard Changes'>
            <MdClose onClick={onCancel} size={20} />
          </Button>
          <Button title={'Apply Changes'}>
            <MdCheck onClick={onUpdate} size={20} />
          </Button>
        </>
      )}
    </Flex>
  )
}

const DeleteButton = ({ onClick }) => (
  <Button onClick={onClick}>
    <MdDelete size={18} />
  </Button>
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
  const [originalData, setOriginalData] = useState(data)
  const updateOriginalData = useCallback(() => setOriginalData(data), [data])
  const skipPageResetRef = React.useRef()
  const router = useRouter()

  const { user } = useUser()

  const isAdminUser = user?.role === 'admin'

  const columns = useMemo(
    () => [
      {
        Header: 'Category Code',
        accessor: 'category_code',
        width: 50,
        // minWidth: 100,
        inputAttrs: {
          type: 'text',
          maxLength: 5,
          size: 10,
          id: 'category_code',
        },
      },
      {
        Header: 'Country Code',
        accessor: 'cc',
        width: 50,
        inputAttrs: {
          type: 'text',
          maxLength: 2,
          size: 4,
        },
      },
      {
        Header: 'Domain',
        accessor: 'domain',
        width: 100,
        inputAttrs: {
          type: 'url',
          size: 28,
        },
      },
      {
        Header: 'URL',
        accessor: 'url',
        // maxWidth: 400,
        inputAttrs: {
          type: 'url',
          size: 44,
        },
      },
      {
        Header: 'Priority',
        accessor: 'priority',
        type: 'number',
        maxWidth: 40,
        inputAttrs: {
          type: 'number',
          maxLength: 2,
          min: 0,
          size: 6,
        },
      },
    ],
    [],
  )

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

  // This allows useTable to reset the table when data changes
  // https://react-table.tanstack.com/docs/faq#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes
  // it should be set to true whenever table data is being altered
  useEffect(() => {
    skipPageResetRef.current = false
  })

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateCellData,
      onRowUpdate,
      onRowDelete,
      resetRow,
      initialState: {
        sortBy: [
          {
            id: 'priority',
            desc: true,
          },
        ],
      },
      initialRowStateAccessor: () => ({ isEditing: false, dirty: false }),
      autoResetRowState: !skipPageResetRef.current,
      autoResetSortBy: !skipPageResetRef.current,
    },
    useFlexLayout,
    useRowState,
    useSortBy,
    (hooks) => {
      if (isAdminUser) {
        hooks.visibleColumns.push((columns) => [
          {
            id: 'edit',
            maxWidth: 32,
            Cell: EditButton,
          },
          ...columns,
          {
            id: 'delete',
            maxWidth: 16,
            Cell: ({ row: { index } }) => (
              <DeleteButton onClick={() => onRowDelete(index)} />
            ),
          },
        ])
      }
    },
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  const { key: tableBodyKey, ...tableBodyProps } = getTableBodyProps()
  return (
    // apply the table props
    <Table {...getTableProps()}>
      <TableHeader>
        {
          // Loop over the header rows
          headerGroups.map((headerGroup) => {
            const { key: headerGroupKey, ...headerGroupProps } =
              headerGroup.getHeaderGroupProps()

            return (
              // Apply the header row props
              <tr key={headerGroupKey} {...headerGroupProps}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => {
                    const { key: columnHeaderKey, ...columnHeaderProps } =
                      column.getHeaderProps(column.getSortByToggleProps())

                    return (
                      // Apply the header cell props
                      <th key={columnHeaderKey} {...columnHeaderProps}>
                        {
                          // Render the header
                          column.render('Header')
                        }
                        <TableSortLabel
                          active={column.isSorted}
                          direction={column.isSortedDesc ? 'desc' : 'asc'}
                        />
                      </th>
                    )
                  })
                }
              </tr>
            )
          })
        }
      </TableHeader>
      {/* Apply the table body props */}
      <tbody key={tableBodyKey} {...tableBodyProps}>
        {
          // Loop over the table rows
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row)
            const { key: rowKey, ...rowProps } = row.getRowProps()
            return (
              // Apply the row props
              <TableRow key={rowKey} {...rowProps} index={row.index}>
                {
                  // Loop over the rows cells
                  row.cells.map((cell) => {
                    // Apply the cell props
                    const { key: cellKey, ...cellProps } = cell.getCellProps()
                    return (
                      <TableCell key={cellKey} {...cellProps}>
                        {
                          // Render the cell contents
                          cell.render('Cell')
                        }
                      </TableCell>
                    )
                  })
                }
              </TableRow>
            )
          })
        }
      </tbody>
    </Table>
  )
}

export default List
