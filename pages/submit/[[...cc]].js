import { useRouter } from 'next/router'
import { Heading } from 'ooni-components/dist/components'

import Layout from '../../components/Layout'
import UrlList from '../../components/submit/UrlList'
import AddURL from '../../components/submit/AddURL'
import AddRule from '../../components/AddRule'

export default function Submit() {
  const { query } = useRouter()
  const { cc } = query
  return (
    <Layout title='Url Submission'>
      <Heading h={1}>URLs for {cc}</Heading>
      <AddURL cc={cc} />
      <hr />
      {cc && <UrlList cc={cc} />}
    </Layout>
  )
}