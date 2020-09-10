import React, { useRef } from 'react'
import { Flex, Box } from 'ooni-components'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes'

const dashedBoxStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
}


const UrlCard = ({
  id,
  index,
  moveCard,
  url,
  category_code,
  country_code
}) => {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))


  return (
    <Flex ref={ref} style={{...dashedBoxStyle, opacity}}
      my={2} p={3}
      flexDirection={['column', 'row']}
      justifyContent={['space-between']}
      sx={{ border: '1px solid', borderColor: 'gray6' }}
    >
      <Box>
        {index}
      </Box>
      <Box width={2/3}>
        {url}
      </Box>
      <Box>
        {category_code}
      </Box>
      <Box>
        {country_code}
      </Box>
    </Flex>
  )
}
export default UrlCard
