import React, { useCallback, useMemo } from 'react'
import { useTable, useFlexLayout, useSortBy } from 'react-table'
import { theme } from 'ooni-components'
import styled from 'styled-components'
import { MdDelete, MdEdit, MdArrowUpward, MdArrowDownward } from 'react-icons/md'

import categories from '../lib/category_codes.json'

const BORDER_COLOR = theme.colors.gray6
const ODD_ROW_BG = theme.colors.gray2
const EVEN_ROW_BG = theme.colors.gray0

const Table = styled.table`
  width: 100%;
  .secondary {
    @media (max-width: 768px) {
      display: none;
    }
  }
`

const TableHeader = styled.thead`
  background-color: white;
  & th {
    display: flex;
    align-items: center;
    text-align: start;
    margin: 0;
    padding: 0.5rem;
  }
`

const TableRow = styled.tr`
  :nth-child(odd) {
    background-color: ${ODD_ROW_BG};
  }
  :nth-child(even) {
    background-color: ${EVEN_ROW_BG};
  }
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
    word-wrap: break-word;
  }

  input {
    font-size: 1rem;
    padding: 0;
    margin: 0;
    border: 0;
  }
  /* TODO: Input validation styling */
`

const Button = styled.button`
  background-color: transparent;
  border: 0;
  padding: 0;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'}
`

const EditButton = ({ row: { index }, onEdit, submissionState }) => {
  const editRow = useCallback(() => {
    onEdit(index)
  }, [onEdit, index])

  return (
    <Button title='Edit' mx='auto'><MdEdit onClick={editRow} size={20} /></Button>
  )
}

const DeleteButton = ({ row: { index }, onDelete, submissionState }) => {
  const deleteRow = useCallback(() => {
    onDelete(index)
  }, [onDelete, index])

  return (
    <Button title='Delete' onClick={deleteRow}><MdDelete size={18} /></Button>
  )
}

const TableSortLabel = ({ active = false, direction = 'desc', size = 16 }) => (
  active
    ? (
        direction === 'asc'
          ? (
      <MdArrowUpward size={size} />
            )
          : (
      <MdArrowDownward size={size} />
            )
      )
    : null
)

const StyledCategoryCell = styled.span`
  font-size: medium;
  cursor: help;
  margin-top: -6px;
  position: absolute;
`

const CategoryCell = React.memo(({ cell: { value } }) => (
  (value in categories) &&
  <>
    {categories[value][0]}
    <StyledCategoryCell title={categories[value][1]}>ℹ</StyledCategoryCell>
  </>
))

CategoryCell.displayName = 'CategoryCell'

const DateCell = React.memo(({ cell: { value } }) => {
  try {
    const date = new Date(value)
    const formattedDate = new Intl.DateTimeFormat([], { dateStyle: 'medium' }).format(date)
    return formattedDate
  } catch (e) {
    console.error(`Cannot parse date: ${value}`, e.message)
    return ''
  }
})
DateCell.displayName = 'DateCell'

const TableView = ({ data, onEdit, onDelete, skipPageReset, submissionState }) => {
  const columns = useMemo(() => [
    {
      Header: 'URL',
      accessor: 'url',
      minWidth: 100,
      inputAttrs: {
        type: 'url',
        size: 44
      },
    },
    {
      Header: 'Category',
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
      Header: 'Date Added',
      accessor: 'date_added',
      maxWidth: 40,
      Cell: DateCell,
      className: 'secondary'
    },
    {
      Header: 'Source',
      accessor: 'source',
      maxWidth: 40,
      className: 'secondary'
    },
    {
      Header: 'Notes',
      accessor: 'notes',
      minWidth: 100,
      inputAttrs: {
        type: 'text',
        maxLength: 20,
        size: 32
      },
      className: 'secondary'
    },
  ], [])

  const tableInstance = useTable({
    columns,
    data,
    onEdit,
    onDelete,
    submissionState,
    autoResetSortBy: !skipPageReset
  },
  useFlexLayout,
  useSortBy,
  hooks => {
    hooks.visibleColumns.push(columns => [
      ...columns,
      {
        id: 'edit',
        maxWidth: 16,
        Cell: EditButton
      },
      {
        id: 'delete',
        maxWidth: 16,
        Cell: DeleteButton
      }
    ])
  }
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInstance

  return (
    // apply the table props
    <Table
      {...getTableProps()}
    >
      <TableHeader>
        {// Loop over the header rows
        /* eslint-disable react/jsx-key */
        headerGroups.map(headerGroup => (
          // Apply the header row props
          <tr {...headerGroup.getHeaderGroupProps()}>
            {// Loop over the headers in each row
            headerGroup.headers.map(column => (
              // Apply the header cell props
              <th {...column.getHeaderProps([column.getSortByToggleProps(), { className: column.className }])}>
                {// Render the header
                column.render('Header')}
                <TableSortLabel active={column.isSorted} direction={column.isSortedDesc ? 'desc' : 'asc'} />
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
                  <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>
                    {// Render the cell contents
                    cell.render('Cell')}
                  </TableCell>
                )
              })}
            </TableRow>
          )
          /* eslint-enable */
        })}
      </tbody>
    </Table>
  )
}

export default TableView
