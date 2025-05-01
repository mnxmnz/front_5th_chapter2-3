import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui"

interface SortOrderFilterProps {
  sortOrder: string
  setSortOrder: (value: string) => void
}

const SortOrderFilter = ({ sortOrder, setSortOrder }: SortOrderFilterProps) => {
  return (
    <Select value={sortOrder} onValueChange={setSortOrder}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="정렬 순서" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asc">오름차순</SelectItem>
        <SelectItem value="desc">내림차순</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default SortOrderFilter
