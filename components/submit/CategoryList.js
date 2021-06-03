import categories from '../lib/category_codes.json'

const CategoryList = ({...rest}) => (
  <select {...rest}>
    {Object.entries(categories).map(([code, description], index) => (
      <option key={index} value={code}>{description}</option>
    ))}
  </select>
)

export default CategoryList