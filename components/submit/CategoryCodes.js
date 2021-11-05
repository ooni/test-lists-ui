import React, { useCallback, useMemo, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { useTable } from 'react-table'
import { Box, Flex } from 'ooni-components'
import categories from '../lib/category_codes.json'
import ModalWithEsc from './ModalWithEsc'

export const CategoryList = ({ name, defaultValue, ...rest }) => (
  <select name={name} {...rest}>
    <option value=''>Select a category</option>
    {Object.entries(categories)
      .sort((c1, c2) => c1[1] > c2[1] ? 1 : -1)
      .map(([code, [description, fullDescription]], index) => (
        <option key={index} value={code} selected={defaultValue === code} title={fullDescription}>
          {description}
        </option>
      ))
    }
  </select>
)

const CategoryTable = () => {
  const data = useMemo(() =>
    Object.entries(categories)
      .sort((c1, c2) => c1[1] > c2[1] ? 1 : -1)
      .map(([code, [description, fullDescription]], index) => ({
        code,
        description: `${description} (${code})`,
        fullDescription
      }))
  , [])

  const columns = useMemo(() => [
    {
      Header: 'Category',
      accessor: 'description'
    },
    {
      Header: 'Description',
      accessor: 'fullDescription'
    },
    {
      /* This column is hidden with `initialState.hiddenColumns` */
      Header: 'Code',
      accessor: 'code',
    }
  ], [])

  const initialState = {
    hiddenColumns: ['code']
  }

  const tableInstance = useTable({ columns, data, initialState })
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance
  return (
    <table {...getTableProps()}>
       <thead>
         {headerGroups.map(headerGroup => (
           /* eslint-disable react/jsx-key */
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps()}
                 style={{
                   fontWeight: 'bold',
                   fontSize: '1.2em'
                 }}
               >
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
       </thead>

       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                     style={{
                       padding: '10px',
                     }}
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
  /* eslint-enable react/jsx-key */
}

export const useCategoryReference = () => {
  const [modalShowing, setModalShowing] = useState(false)
  const showCategoryReference = useCallback(() => {
    setModalShowing(true)
  }, [])
  const hideCategeryReference = useCallback(() => {
    setModalShowing(false)
  }, [])

  const categoryModal = useMemo(() => {
    return React.createElement(CategoryReference, {
      show: modalShowing,
      onCancel: hideCategeryReference,
      onHideClick: hideCategeryReference
    })
  }, [hideCategeryReference, modalShowing])

  return {
    categoryModal,
    showCategoryReference,
    hideCategeryReference
  }
}

const CloseButton = (props) => (
  <Box sx={{ cursor: 'pointer', position: 'absolute', right: 10, top: 10 }} {...props}>
    <MdClose size={24} />
  </Box>
)

export const CategoryReference = (props) => {
  return (
    <ModalWithEsc {...props} show={props.show} zIndex={1100}>
      <CloseButton onClick={props.onCancel} />
      <Flex flexDirection='column' sx={{ height: '90vh' }}>
        <CategoryTable />
      </Flex>
    </ModalWithEsc>
  )
}
