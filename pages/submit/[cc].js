import { useRouter } from 'next/router'
import { Heading } from 'ooni-components/dist/components'

import Layout from '../../components/Layout'
import UrlList from '../../components/submit/UrlList'
import AddURL from '../../components/submit/AddURL'

export default function Submit () {
  const { query: { cc } } = useRouter()
  return (
    <Layout title='Url Submission'>
      <Heading h={1}>URLs for {cc}</Heading>
      {cc && <AddURL cc={cc} />}
      {cc && <UrlList cc={cc} />}
    </Layout>
  )
}
