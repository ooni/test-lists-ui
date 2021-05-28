import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTable, defaultRenderer as Cell, useFlexLayout, useRowState } from 'react-table'
import { theme, Box, Flex } from 'ooni-components'
import styled from 'styled-components'
import { MdDelete, MdEdit, MdClose, MdCheck } from 'react-icons/md'

const BORDER_COLOR = theme.colors.gray6
const ODD_ROW_BG = theme.colors.gray0
const EVEN_ROW_BG = theme.colors.gray2

const Table = styled.table`
  width: 100%;
`

const TableHeader = styled.thead`
  background-color: white;
  & th {
    text-align: start;
    padding: 12px;
  }
`

const TableRow = styled.tr`
  background-color: ${props => props.index % 2 === 0 ? EVEN_ROW_BG : ODD_ROW_BG};
  :first-child {
    border-top: 1px solid ${BORDER_COLOR};
  }
  :last-child {
    border-bottom: 1px solid ${props => props.theme.colors.gray6};
  }
`

const TableCell = styled.td`
  margin: 0;
  padding: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.gray6};

  :last-child {
    border-right: 1px solid ${props => props.theme.colors.gray6};
  }
  :first-child {
    border-left: 1px solid ${props => props.theme.colors.gray6};
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
  row: { index, original, state : { isEditing }, setState },
  column: { id, inputAttrs = {} },
  updateCellData,
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = e => {
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
    return <input {...inputAttrs} value={value} onChange={onChange} onBlur={onBlur} />
  } else {
    return <Cell value={value} />
  }
}

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
}

const Button = styled.button`
  background-color: transparent;
  border: 0;
  padding: 0;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'}
`

// Dynamic button
// * Starts editing a row
// * Switches to a two button component to confirm or cancel a row edit operation.
const EditButton = ({ isEditing, dirty, onEdit, onCancel, onUpdate }) => (
  <Flex flexDirection='row' justifyContent='space-around'>
    {!isEditing && <Button mx='auto'><MdEdit onClick={onEdit} size={20} /></Button>}
    {isEditing && (
      <>
        <Button title='Discard Changes'><MdClose onClick={onCancel} size={20} /></Button>
        <Button disabled={!dirty} title={dirty && 'Apply Changes'}><MdCheck onClick={onUpdate} size={20} /></Button>
      </>
    )}
  </Flex>
)

const DeleteButton = ({ onClick }) => (
  <Button onClick={onClick}><MdDelete size={18} /></Button>
)

const List = ({ initialData, mutateData, onUpdateRule }) => {
  const [data, setData] = useState(initialData)
  const [originalData] = useState(data)
  const resetData = () => setData(originalData)
  const skipPageResetRef = React.useRef()

  const columns = useMemo(() => [
    {
      'Header': 'Category Code',
      'accessor': 'category_code',
      width: 50,
      // minWidth: 100,
      inputAttrs: {
        type: 'text',
        maxLength: 5,
        size: 10,
        id: 'category_code',
      }
    },
    {
      'Header': 'Country Code',
      'accessor': 'cc',
      width: 50,
      inputAttrs: {
        type: 'text',
        maxLength: 2,
        size: 4,
      },
    },
    {
      'Header': 'Domain',
      'accessor': 'domain',
      width: 100,
      inputAttrs: {
        type: 'url',
        size: 28
      },
    },
    {
      'Header': 'URL',
      'accessor': 'url',
      // maxWidth: 400,
      inputAttrs: {
        type: 'url',
        size: 44,
      },
    },
    {
      'Header': 'Priority',
      'accessor': 'priority',
      type: 'number',
      maxWidth: 40,
      inputAttrs: {
        type: 'number',
        maxLength: 2,
        min: 0,
        size: 6
      },
    },
  ], [])

  // Called whenever a cell is changed so that the table data
  // and controlled inputs are in sync
  const updateCellData = useCallback((rowIndex, columnId, value) => {
    skipPageResetRef.current = true
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }, [data])

  // Called to reverse the changes by updateCellData for the whole row
  // based on data stored in originalData received from API
  const resetRow = useCallback(( rowIndex ) => {
    skipPageResetRef.current = true
    setData(old => 
      old.map((row, index) => {
        if (index === rowIndex) {
          return originalData[rowIndex]
        }
        return row
      })
    )
  }, [data])

  const deleteRow = useCallback((rowIndex) => {
    return (e) => {
      skipPageResetRef.current = true
      console.log(rowIndex)
    }
  })

  // This allows useTable to reset the table when data changes
  // https://react-table.tanstack.com/docs/faq#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes
  // it should be set to true whenever table data is being altered
  useEffect(() => {
    skipPageResetRef.current = false
  })

  const tableInstance = useTable({
    columns,
    data,
    defaultColumn,
    updateCellData,
    initialRowStateAccessor: () => ({ isEditing: false, dirty: false }),
    autoResetRowState: !skipPageResetRef.current,
  },
    useFlexLayout,
    useRowState,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'edit',
          maxWidth: 32,
          Cell: ({ row: { index, values, state : { isEditing, dirty }, setState } }) => (
            <EditButton
              isEditing={isEditing}
              dirty={dirty}
              onEdit={() => {
                // TODO: Don't edit if another row is still being edited
                setState({ isEditing: true })
              }}
              onCancel={() => {
                // TODO: Ensure row state is reset before cancelling edit
                resetRow(index)
                setState({ isEditing: false, updatedRow: null })
              }}
              onUpdate={() => {
                // TODO: Trigger update API call
                const newEntry = values
                onUpdateRule(originalData[index], newEntry)
                // TODO: mutate data
                setState({ isEditing: false })
              }}
            />
          )
        },
        ...columns,
        {
          id: 'delete',
          maxWidth: 16,
          Cell: ({ row: { values } }) => (
            <DeleteButton onClick={() => onUpdateRule(values)} />
          )
        }
      ])
    }
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  return (
    // apply the table props
    <Table
      {...getTableProps()}
    >
      <TableHeader>
        {// Loop over the header rows
        headerGroups.map(headerGroup => (
          // Apply the header row props
          <tr {...headerGroup.getHeaderGroupProps()}>
            {// Loop over the headers in each row
            headerGroup.headers.map(column => (
              // Apply the header cell props
              <th {...column.getHeaderProps()}>
                {// Render the header
                column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </TableHeader>

      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {// Loop over the table rows
        rows.map(row => {
          // Prepare the row for display
          prepareRow(row)

          return (
            // Apply the row props
            <TableRow {...row.getRowProps()} index={row.index}>
              {// Loop over the rows cells
              row.cells.map(cell => {

                // Apply the cell props
                return (
                  <TableCell {...cell.getCellProps()}>
                    {// Render the cell contents
                    cell.render('Cell')}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </tbody>
    </Table>
  )
}

export default List