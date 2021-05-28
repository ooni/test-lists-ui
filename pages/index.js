import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Flex, Box, Heading, Text } from 'ooni-components'
import useSWR from 'swr'

import { fetcherRules, apiEndpoints, updateRule } from '../components/lib/api'
import Layout from '../components/Layout'
import List from '../components/List'
import { useUser } from '../components/lib/hooks'
import AddRule from '../components/AddRule'

const swrOptions = {
  // dedupingInterval: 10 * 60 * 1000,
}

export default function Home() {
  // const { user } = useUser()

  const { data, error, isValidating, mutate } = useSWR(
    apiEndpoints.RULE_LIST,
    fetcherRules,
    swrOptions
  )

  const onUpdateRule = useCallback((oldEntry = {}, newEntry = {}) => {
    updateRule(oldEntry, newEntry).then(() => {
      mutate()
    }).catch(e => {
      // TODO: Show this error somewhere. maybe where the action was performed
      console.log(`updateRule failed: ${e.response.data.error}`)
    })
  }, [mutate])

  return (
    <Layout title='Dashboard'>
      <Heading h={1} textAlign='center'>URL Priorities</Heading>
      <Flex alignItems='center' mb={3}>
        <button onClick={() => mutate()}> Refresh Data </button>
        <Text ml={3}>Status: {isValidating ? 'Loading...' : 'Ready'}</Text>
      </Flex>
      <AddRule />
      
      {data && <List data={data} mutateRules={mutate} onUpdateRule={onUpdateRule} />}
      {error && !data &&
        <Flex alignItems='center' p={4} bg='red1' flexDirection='column'>
          <Box>{error.status} {error.message}</Box> 
          <Box><Link href='/login'> Login </Link></Box>
        </Flex>
      }
    </Layout>
  )
}
