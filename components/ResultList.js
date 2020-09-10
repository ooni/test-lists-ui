import { useState, useCallback, useMemo } from 'react'
import { Flex, Box, Heading } from 'ooni-components'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'

import Card from './UrlCard'

const Output = ({ urls }) => {
  const prioritizedUrls = JSON.stringify(urls, null, 2)
  return (
    <Flex bg='gray2' flexDirection='column' my={4}>
      <Heading h={3} m={3}>Prioritized URLs</Heading>
      <Box m={3} bg='white'>
        <pre>
          {prioritizedUrls}
        </pre>
      </Box>
    </Flex>
  )
}

const ResultList = ({ urls }) => {
  const [cards, setCards] = useState(urls)

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex]
      setCards(
        update(cards,{
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard]
          ]
        })
      )
    },
    [cards]
  )

  const renderCard = (card, index) => {
    return (
      <Card
        key={card.id}
        index={index}
        moveCard={moveCard}
        {...card}
      />
    )
  }

  const prioritizedUrls = useMemo(() => {
    return cards.map(({id, ...card}, index) => ({...card, priority: index}))
  }, [cards])

  return (
    <Flex flexDirection='column'>
      <Flex m={3} flexDirection='column'>
        <Flex my={2} p={3} justifyContent={['space-between']}
          flexDirection={['column', 'row']}
          sx={{ border: '1px solid', borderColor: 'gray6' }}
        >
          <Box>
            prority
          </Box>
          <Box width={2/3}>
            url
          </Box>
          <Box>
            category_code
          </Box>
          <Box>
            country_code
          </Box>
        </Flex>
        <DndProvider backend={HTML5Backend}>
          {cards.map((card, index) => renderCard(card, index))}
        </DndProvider>
      </Flex>
      <Output urls={prioritizedUrls} />
    </Flex>
  )
}

export default ResultList
