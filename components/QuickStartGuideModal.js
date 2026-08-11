import { Modal } from 'ooni-components'
import { useIntl } from 'react-intl'

const QuickStartGuideModal = ({ show, setShowModal }) => {
  const { formatMessage } = useIntl()

  return (
    <Modal show={show} className="min-w-[340px]">
      <div className="container px-0 md:px-4">
        <div className="flex flex-col">
          <h4 className="text-center">
            {formatMessage({ id: 'QuickStartGuide.Title' })}
          </h4>
          <ol className="my-0 list-decimal pl-3 px-5 text-xs md:my-2">
            {[...Array(6)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <li className="my-2" key={i}>
                {formatMessage({ id: `QuickStartGuide.${i + 1}` })}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="my-4 flex justify-center">
        <button
          className="btn btn-primary mx-4 w-1/3"
          type="button"
          onClick={() => setShowModal(false)}
        >
          <span className="font-bold">
            {formatMessage({ id: 'QuickStartGuide.Close' })}
          </span>
        </button>
      </div>
    </Modal>
  )
}

export default QuickStartGuideModal
