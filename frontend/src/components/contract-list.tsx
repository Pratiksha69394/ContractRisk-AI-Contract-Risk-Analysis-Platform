import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, AlertTriangle, CheckCircle, Clock, ArrowRight, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'

interface Contract {
  id: string
  name: string
  uploadDate: string
  status: 'analyzed' | 'analyzing'
  riskScore: number
  riskLevel: 'high' | 'medium' | 'low' | 'pending'
  summary?: string
}

interface ContractListProps {
  contracts: Contract[]
  onViewContract: (id: string) => void
  onDeleteContract?: (id: string) => void
}

export default function ContractList({ contracts, onViewContract, onDeleteContract }: ContractListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contractToDelete, setContractToDelete] = useState<string | null>(null)

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />
      default: return <Clock className="w-4 h-4 text-slate-600" />
    }
  }

  const handleDeleteClick = (e: any, contractId: string) => {
    e.stopPropagation()
    setContractToDelete(contractId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (contractToDelete && onDeleteContract) {
      onDeleteContract(contractToDelete)
    }
    setDeleteDialogOpen(false)
    setContractToDelete(null)
  }

  const getContractName = (id: string) => {
    const contract = contracts.find(c => c.id === id)
    return contract?.name || 'this contract'
  }

  return (
    <>
      <div className="grid gap-4">
        {contracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewContract(contract.id)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-100 rounded-lg">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg text-slate-900">{contract.name}</h3>
                      {getRiskIcon(contract.riskLevel)}
                    </div>
                    <p className="text-sm text-slate-500 mb-3">Uploaded on {contract.uploadDate}</p>
                    {contract.summary && (
                      <p className="text-slate-600 text-sm line-clamp-2">{contract.summary}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${getRiskColor(contract.riskLevel)} border capitalize`}>
                    {contract.riskLevel} risk
                  </Badge>
                  {contract.status === 'analyzed' && (
                    <span className="text-sm font-medium text-slate-700">{contract.riskScore}%</span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={contract.status === 'analyzed' ? 'default' : 'secondary'} className="capitalize">
                    {contract.status}
                  </Badge>
                  {onDeleteContract && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => handleDeleteClick(e, contract.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Contract
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{getContractName(contractToDelete || '')}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

