

import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ContractList from '@/components/contract-list'
import ContractSearchFilter, { type FilterOptions } from '@/components/contract-search-filter'
import EmptyState from '@/components/empty-state'
import UploadModal from '@/components/upload-modal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

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
  // Use a ref to track contract IDs that are currently being processed
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
      const token = localStorage.getItem('token')
      const response = await fetch('/api/contracts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (Array.isArray(data)) {
        // Deduplicate contracts by ID
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
            // Keep the more recent one (first one is usually most recent due to sort)
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
    const token = localStorage.getItem('token')
    
    // Check if this contract is already being processed (prevent duplicates)
    if (processingContractIds.current.has(contractId)) {
      console.warn('Contract with this ID is already being processed:', contractId)
      return
    }
    
    // Mark this contract ID as being processed
    processingContractIds.current.add(contractId)

    // First, save the contract to the backend with "analyzing" status
    const newContract: Contract = {
      id: contractId,
      name: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'analyzing',
      riskScore: 0,
      riskLevel: 'pending',
    }

    // Add to local state
    setContracts((prev) => [newContract, ...prev])
    setIsUploadOpen(false)

    try {
      // Save contract to backend first
      const saveResponse = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newContract),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save contract')
      }

      // Then run analysis
      await analyzeContract(contractId, file, token)
    } catch (error) {
      console.error('Upload error:', error)
      // Update contract status to show error
      setContracts((prev) =>
        prev.map((c) => (c.id === contractId ? { ...c, status: 'analyzing', riskLevel: 'pending' } : c)),
      )
    } finally {
      // Remove from processing set when done
      processingContractIds.current.delete(contractId)
    }
  }

  const analyzeContract = async (contractId: string, file: File, token: string) => {
    try {
      const content = await file.text()

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contractContent: content,
          contractName: file.name,
          contractId: contractId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const analysis = await response.json()

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

      // Update local state
      setContracts((prev) => prev.map((c) => (c.id === contractId ? updatedContract : c)))

      // Update contract on backend
      await fetch(`/api/contracts/${contractId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedContract),
      })
    } catch (error) {
      console.error('Analysis error:', error)
      // Update contract status to show error
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
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete contract')
      }

      // Remove contract from local state
      setContracts((prev) => prev.filter((c) => c.id !== contractId))
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete contract. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Contract Portfolio</h1>
            <p className="text-slate-600 mt-2">Analyze and manage contract risks with AI-powered insights</p>
          </div>
          <Button
            onClick={() => setIsUploadOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
          >
            <Plus size={20} />
            Upload Contract
          </Button>
        </div>

        {!isLoading && contracts.length > 0 && (
          <ContractSearchFilter
            onSearch={setSearchQuery}
            onFilterChange={setFilters}
            onExport={handleExport}
            contractCount={filteredContracts.length}
          />
        )}

        {!isLoading && contracts.length === 0 ? (
          <EmptyState onUploadClick={() => setIsUploadOpen(true)} />
        ) : (
          <ContractList 
            contracts={filteredContracts} 
            onViewContract={(id) => navigate(`/contract/${id}`)}
            onDeleteContract={handleDeleteContract}
          />
        )}
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} />
    </main>
  )
}

