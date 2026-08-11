import { useIntl } from 'react-intl'

const Footer = () => {
  const { formatMessage } = useIntl()
  return (
    <footer className="mt-8 flex flex-col justify-between bg-blue-900 px-1 py-4 text-gray-200 md:flex-row md:px-8">
      <div className="mx-4 flex flex-col justify-center text-xs text-white">
        <p>
          © {new Date().getFullYear()} Open Observatory of Network
          Interference (OONI)
        </p>
      </div>
      <nav className="my-4 flex flex-col items-start md:my-0 md:flex-row md:items-center">
        <a
          className="mx-4 my-1 text-gray-200 hover:text-white"
          href='https://ooni.org'
        >
          {formatMessage({ id: 'Footer.AboutOONI' })}
        </a>
        <a
          className="mx-4 my-1 text-gray-200 hover:text-white"
          href='https://ooni.org/get-involved/contribute-test-lists'
        >
          {formatMessage({ id: 'Footer.AboutTestLists' })}{' '}
        </a>
        <a
          className="mx-4 my-1 text-gray-200 hover:text-white"
          href='https://github.com/citizenlab/test-lists/'
        >
          {formatMessage({ id: 'Footer.TestListsGithub' })}
        </a>
        <a
          className="mx-4 my-1 text-gray-200 hover:text-white"
          href='https://github.com/ooni/test-lists-ui'
        >
          {formatMessage({ id: 'Footer.SourceCode' })}
        </a>
      </nav>
    </footer>
  )
}

export default Footer
