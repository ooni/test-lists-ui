import categories from '../lib/category_codes.json'

const CategoryList = ({ name, defaultValue, ...rest }) => (
  <select name={name} {...rest}>
    <option value=''>Select a category</option>
    {Object.entries(categories)
      .sort((c1, c2) => c1[1] > c2[1] ? 1 : -1)
      .map(([code, [description, fullDescription]], index) => (
        <option key={index} value={code} selected={defaultValue === code}>{description}</option>
      ))
    }
  </select>
)

export default CategoryList
