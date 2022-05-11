import { HTMLAttributes } from 'react'
import categories from '../lib/category_codes.json'

type CategoryListProps = HTMLAttributes<HTMLSelectElement> & { name: string, required: boolean }

const CategoryList = ({ name, defaultValue, ...rest }: CategoryListProps) => (
  <select name={name} {...rest}>
    <option value=''>Select a category</option>
    {Object.entries(categories)
      .sort((c1, c2) => c1[1] > c2[1] ? 1 : -1)
      .map(([code, [description, fullDescription]], index) => (
        <option key={index} value={code} selected={defaultValue === code} title={fullDescription}>
          {description}
        </option>
      ))
    }
  </select>
)

export default CategoryList
