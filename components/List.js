import React, { useMemo } from 'react'
import { useTable } from 'react-table'
import { theme } from 'ooni-components'
import styled from 'styled-components'
import { MdDelete } from 'react-icons/md'

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

const TableCell = styled.td`
  padding: 12px;
`

const ODD_ROW_BG = theme.colors.gray0
const EVEN_ROW_BG = theme.colors.gray2

const getRowProps = row => {
  console.log(row)
  return ({
  style: {
    backgroundColor: row.index % 2 === 0 ? EVEN_ROW_BG : ODD_ROW_BG
  }
})}


const List = ({ data }) => {
  const reshapedData = useMemo(() => {
    return data
  }, [])

  const columns = useMemo(() => [
    {
      'Header': 'Category Code',
      'accessor': 'category_code'
    },
    {
      'Header': 'Country Code',
      'accessor': 'cc'
    },
    {
      'Header': 'Domain',
      'accessor': 'domain'
    },
    {
      'Header': 'URL',
      'accessor': 'url'
    },
    {
      'Header': 'Priority',
      'accessor': 'priority'
    },
    {
      'id': 'deleteAction',
      'Header': '',
      'Cell': ({ row }) => <MdDelete size={18} />
    },

    // {
    //   'Header': '',
    //   'accessor': ''
    // },
  ], [])

  const tableInstance = useTable({ columns, data })


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