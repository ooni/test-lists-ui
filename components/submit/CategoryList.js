import categories from '../lib/category_codes.json'

const CategoryList = ({ name, defaultValue, ...rest }) => (
  <select name={name} {...rest}>
    <option value=''>Select a category</option>
    {Object.entries(categories).map(([code, description], index) => (
      <option key={index} value={code} selected={defaultValue === code}>{description}</option>
    ))}
  </select>
)

export default CategoryList
