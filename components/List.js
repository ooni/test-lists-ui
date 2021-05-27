import React, { useCallback, useMemo, useState } from 'react'
import { useTable, defaultRenderer as Cell, useFlexLayout, useRowState } from 'react-table'
import { theme, Box, Flex } from 'ooni-components'
import styled from 'styled-components'
import { MdDelete, MdEdit, MdClose, MdCheck } from 'react-icons/md'
import { ImCheckmark, ImCross } from 'react-icons/im'
import { mutate } from 'swr'

const BORDER_COLOR = theme.colors.gray6

const Table = styled.table`
  width: 100%;
  & tbody tr {
    :first-child {
      border-top: 1px solid ${BORDER_COLOR};
    }
    :last-child {
      border-bottom: 1px solid ${props => props.theme.colors.gray6};
    }
  }
`

const TableHeader = styled.thead`
  background-color: white;
  & th {
    text-align: start;
    padding: 12px;
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
`

const ODD_ROW_BG = theme.colors.gray0
const EVEN_ROW_BG = theme.colors.gray2

// Styles alternate rows with contrasting background colors
const getRowProps = row => {
  return ({
    style: {
      backgroundColor: row.index % 2 === 0 ? EVEN_ROW_BG : ODD_ROW_BG
    }
})}

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index, original, state : { isEditing, updatedRow }, setState },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  // Collect updates in the rowState under 
  const onBlur = () => {
    // TODO: Record row update only if value changes
    setState((prevState) => ({
      ...prevState,
      updatedRow: {
        ...prevState.updatedRow,
        [id]: value
      }
    }))
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (isEditing) {
    return <input value={value} onChange={onChange} onBlur={onBlur} />
  } else {
    return <Cell value={value} />
  }
}

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
}

const Button = styled(Box)`
  cursor: pointer;
`

// Dynamic button
// * Starts editing a row
// * Switches to a two button component to confirm or cancel a row edit operation.
const EditButton = ({ isEditing, onEdit, onCancel, onUpdate }) => (
  <Flex flexDirection='row' justifyContent='space-around'>
    {!isEditing && <Button mx='auto'><MdEdit onClick={onEdit} size={20} /></Button>}
    {isEditing && (
      <>
        <Button><MdClose onClick={onCancel} size={20} /></Button>
        <Button><MdCheck onClick={onUpdate} size={20} /></Button>
      </>
    )}
  </Flex>
)

const DeleteButton = ({ onClick }) => (
  <Button onClick={onClick}><MdDelete size={18} /></Button>
)

const List = ({ initialData, mutateData }) => {
  const [data, setData] = useState(initialData)
  // const [originalData] = useState(data)
  // const resetData = () => setData(originalData)

  const columns = useMemo(() => [
    {
      'Header': 'Category Code',
      'accessor': 'category_code',
      width: 50,
      // minWidth: 100,
    },
    {
      'Header': 'Country Code',
      'accessor': 'cc',
      width: 50,
    },
    {
      'Header': 'Domain',
      'accessor': 'domain',
      width: 100,
    },
    {
      'Header': 'URL',
      'accessor': 'url',
      // maxWidth: 400,
    },
    {
      'Header': 'Priority',
      'accessor': 'priority',
      maxWidth: 40,
    },
    // {
    //   'Header': '',
    //   'accessor': ''
    // },
  ], [])

  const updateMyData = useCallback((rowIndex, columnId, value) => {
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

  const updateRowInData = useCallback((rowIndex, updatedRow) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return updatedRow
        }
        return row
      })
    )
  }, [data])


  const deleteRow = useCallback((rowIndex) => {
    return (e) => {
      console.log(rowIndex)
    }
  })

  const tableInstance = useTable(
    { columns, data, defaultColumn, updateMyData, updateRowInData, initialRowStateAccessor: () => ({ isEditing: false, updatedRow: null }) },
    useFlexLayout,
    useRowState,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'edit',
          maxWidth: 32,
          // Cell: ({ row }) => (
          Cell: ({ row: { index, original, state : { isEditing, updatedRow }, setState } }) => (
            <EditButton
              isEditing={isEditing}
              onEdit={() => {
                // TODO: Don't edit if another row is still being edited
                setState({ isEditing: true })
              }}
              onCancel={() => {
                // TODO: Ensure row state is reset before cancelling edit
                setState({ isEditing: false, updatedRow: null })
              }}
              onUpdate={() => {
                // TODO: Trigger update API call
                console.log('send update to API')
                const newEntry = {...original, ...updatedRow}
                console.log({
                  old_entry: original,
                  new_entry: newEntry
                })
                // TODO: mutate data
                // updateRowInData(index, newEntry)
                // TODO: maybe reset row state if still needed
                setState({ isEditing: false })
              }}
            />
          )
        },
        ...columns,
        {
          id: 'delete',
          maxWidth: 16,
          Cell: ({ row }) => (
            <DeleteButton onClick={deleteRow(row.index)} />
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
            <tr {...row.getRowProps(getRowProps(row))}>
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
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default List