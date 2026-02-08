import { useState } from 'react'
import { Search, Filter, Download, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export interface FilterOptions {
  riskLevel: string[]
  status: string[]
  dateRange: string
}

interface ContractSearchFilterProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: FilterOptions) => void
  onExport: (format: 'pdf' | 'csv' | 'json') => void
  contractCount: number
}

export default function ContractSearchFilter({
  onSearch,
  onFilterChange,
  onExport,
}: ContractSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [riskLevels, setRiskLevels] = useState<string[]>([])
  const [statuses, setStatuses] = useState<string[]>([])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const toggleRiskLevel = (level: string) => {
    const newLevels = riskLevels.includes(level)
      ? riskLevels.filter((l) => l !== level)
      : [...riskLevels, level]
    setRiskLevels(newLevels)
    onFilterChange({ riskLevel: newLevels, status: statuses, dateRange: 'all' })
  }

  const toggleStatus = (status: string) => {
    const newStatuses = statuses.includes(status)
      ? statuses.filter((s) => s !== status)
      : [...statuses, status]
    setStatuses(newStatuses)
    onFilterChange({ riskLevel: riskLevels, status: newStatuses, dateRange: 'all' })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5 sm:mb-6">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
        <Input
          placeholder="Search contracts..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 h-10 sm:h-11 w-full"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 whitespace-nowrap h-10 sm:h-11 flex-shrink-0 touch-manipulation">
              <Filter size={16} />
              <span className="hidden xs:inline sm:hidden md:inline">Risk</span>
              <span className="hidden sm:inline">Risk Level</span>
              {riskLevels.length > 0 && (
                <Badge variant="secondary" className="ml-1">{riskLevels.length}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by Risk Level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={riskLevels.includes('high')}
              onCheckedChange={() => toggleRiskLevel('high')}
            >
              High Risk
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={riskLevels.includes('medium')}
              onCheckedChange={() => toggleRiskLevel('medium')}
            >
              Medium Risk
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={riskLevels.includes('low')}
              onCheckedChange={() => toggleRiskLevel('low')}
            >
              Low Risk
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 whitespace-nowrap h-10 sm:h-11 flex-shrink-0 touch-manipulation">
              <SlidersHorizontal size={16} />
              <span className="hidden xs:inline sm:hidden md:inline">Status</span>
              <span className="hidden sm:inline">Status</span>
              {statuses.length > 0 && (
                <Badge variant="secondary" className="ml-1">{statuses.length}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={statuses.includes('analyzed')}
              onCheckedChange={() => toggleStatus('analyzed')}
            >
              Analyzed
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statuses.includes('analyzing')}
              onCheckedChange={() => toggleStatus('analyzing')}
            >
              Analyzing
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 whitespace-nowrap h-10 sm:h-11 flex-shrink-0 touch-manipulation">
              <Download size={16} />
              <span className="hidden xs:inline sm:hidden md:inline">Export</span>
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Export Data</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem onClick={() => onExport('csv')}>
              Export as CSV
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => onExport('json')}>
              Export as JSON
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => onExport('pdf')}>
              Export as PDF
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
    