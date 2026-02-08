import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ContractList from '@/components/contract-list'
import ContractSearchFilter, { type FilterOptions } from '@/components/contract-search-filter'
import EmptyState from '@/components/empty-state'
import UploadModal from '@/components/upload-modal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { authenticatedApiRequest, apiRequest } from '@/lib/api'

interface Contract {
  id: string
  name: string
  uploadDate: string
  status: 'analyzed' | 'analyzing'
  riskScore: number
  riskLevel: 'high' | 'medium' | 'low' | 'pending'
  summary?: string
  keyRisks?: any[]
  recommendations?: string[]
}

export default function Home() {
  const navigate = useNavigate()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    riskLevel: [],
    status: [],
    dateRange: 'all',
  })
  const processingContractIds = useRef<Set<string>>(new Set())

  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      if (searchQuery && !contract.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (filters.riskLevel.length > 0 && !filters.riskLevel.includes(contract.riskLevel)) {
        return false
      }
      if (filters.status.length > 0 && !filters.status.includes(contract.status)) {
        return false
      }
      return true
    })
  }, [contracts, searchQuery, filters])

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      const data = await authenticatedApiRequest<any[]>('/api/contracts')
      
      if (Array.isArray(data)) {
        const uniqueContracts = data.reduce((acc, contract) => {
          const existingIndex = acc.findIndex(c => c.id === contract._id || c.id === contract.id)
          if (existingIndex === -1) {
            acc.push({
              id: contract._id || contract.id,
              name: contract.name,
              uploadDate: contract.uploadDate ? new Date(contract.uploadDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              status: contract.status,
              riskScore: contract.riskScore || 0,
              riskLevel: contract.riskLevel || 'pending',
              summary: contract.summary,
              keyRisks: contract.keyRisks,
              recommendations: contract.recommendations
            })
          } else {
            acc[existingIndex] = {
              id: contract._id || contract.id,
              name: contract.name,
              uploadDate: contract.uploadDate ? new Date(contract.uploadDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              status: contract.status,
              riskScore: contract.riskScore || 0,
              riskLevel: contract.riskLevel || 'pending',
              summary: contract.summary,
              keyRisks: contract.keyRisks,
              recommendations: contract.recommendations
            }
          }
          return acc
        }, [])
        setContracts(uniqueContracts)
      } else {
        setContracts([])
      }
    } catch (error) {
      console.error('Failed to fetch contracts:', error)
      setContracts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (file: File, contractId: string) => {
    if (processingContractIds.current.has(contractId)) {
      console.warn('Contract with this ID is already being processed:', contractId)
      return
    }
    
    processingContractIds.current.add(contractId)

    const newContract: Contract = {
      id: contractId,
      name: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'analyzing',
      riskScore: 0,
      riskLevel: 'pending',
    }

    setContracts((prev) => [newContract, ...prev])
    setIsUploadOpen(false)

    try {
      await authenticatedApiRequest('/api/contracts', {
        method: 'POST',
        body: JSON.stringify(newContract),
      })

      await analyzeContract(contractId, file)
    } catch (error) {
      console.error('Upload error:', error)
      setContracts((prev) =>
        prev.map((c) => (c.id === contractId ? { ...c, status: 'analyzing', riskLevel: 'pending' } : c)),
      )
    } finally {
      processingContractIds.current.delete(contractId)
    }
  }

  const analyzeContract = async (contractId: string, file: File) => {
    try {
      const content = await file.text()

      const analysis = await authenticatedApiRequest<{
        riskScore: number
        riskLevel: string
        summary: string
        keyRisks: any[]
        recommendations: string[]
      }>('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({
          contractContent: content,
          contractName: file.name,
          contractId: contractId,
        }),
      })

      const updatedContract = {
        id: contractId,
        name: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'analyzed' as const,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        summary: analysis.summary,
        keyRisks: analysis.keyRisks,
        recommendations: analysis.recommendations,
      }

      setContracts((prev) => prev.map((c) => (c.id === contractId ? updatedContract : c)))

      await apiRequest('/api/contracts/' + contractId, {
        method: 'PATCH',
        body: JSON.stringify(updatedContract),
      })
    } catch (error) {
      console.error('Analysis error:', error)
      setContracts((prev) =>
        prev.map((c) => (c.id === contractId ? { ...c, status: 'analyzing', riskLevel: 'pending' } : c)),
      )
    }
  }

  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    const dataToExport = filteredContracts

    if (format === 'csv') {
      const headers = ['Name', 'Upload Date', 'Status', 'Risk Score', 'Risk Level']
      const rows = dataToExport.map((c) => [c.name, c.uploadDate, c.status, c.riskScore, c.riskLevel])
      const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'contracts.csv'
      a.click()
    } else if (format === 'json') {
      const json = JSON.stringify(dataToExport, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'contracts.json'
      a.click()
    } else if (format === 'pdf') {
      console.log('PDF export - would require jsPDF library')
    }
  }

  const handleDeleteContract = async (contractId: string) => {
    try {
      await authenticatedApiRequest('/api/contracts/' + contractId, {
        method: 'DELETE',
      })

      setContracts((prev) => prev.filter((c) => c.id !== contractId))
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete contract. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6 lg:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Contract Portfolio</h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">Analyze and manage contract risks with AI-powered insights</p>
          </div>
          <Button
            onClick={() => setIsUploadOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto touch-manipulation"
          >
            <Plus size={18} />
            <span>Upload Contract</span>
          </Button>
        </div>

        {!isLoading && contracts.length > 0 && (
          <div className="mb-5 sm:mb-6">
            <ContractSearchFilter
              onSearch={setSearchQuery}
              onFilterChange={setFilters}
              onExport={handleExport}
              contractCount={filteredContracts.length}
            />
          </div>
        )}

        {!isLoading && contracts.length === 0 ? (
          <EmptyState onUploadClick={() => setIsUploadOpen(true)} />
        ) : (
          <ContractList 
            contracts={filteredContracts} 
            onViewContract={(id) => navigate('/contract/' + id)}
            onDeleteContract={handleDeleteContract}
          />
        )}
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} />
    </main>
  )
}

