const ErrorComponent = ({ children, className = '', ...rest }) => (
  <div
    className={`my-2 flex flex-col bg-red-100 px-8 pb-4 text-gray-500 ${className}`}
    {...rest}
  >
    <h5>Errors</h5>
    <pre>{children}</pre>
  </div>
)

export default ErrorComponent
