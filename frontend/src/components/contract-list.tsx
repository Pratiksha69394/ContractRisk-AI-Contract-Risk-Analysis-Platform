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
      <div className="grid gap-3 sm:gap-4 grid-cols-1">
        {contracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-md transition-shadow cursor-pointer touch-manipulation" onClick={() => onViewContract(contract.id)}>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="p-2 sm:p-2.5 bg-slate-100 rounded-lg flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-5 sm:h-5 text-slate-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-sm sm:text-base text-slate-900 truncate">{contract.name}</h3>
                        {getRiskIcon(contract.riskLevel)}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500">{contract.uploadDate}</p>
                      {contract.summary && (
                        <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mt-1">{contract.summary}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 sm:gap-1.5 flex-shrink-0">
                    <Badge className={`${getRiskColor(contract.riskLevel)} border capitalize text-xs`}>
                      {contract.riskLevel}
                    </Badge>
                    {contract.status === 'analyzed' && (
                      <span className="text-xs sm:text-sm font-medium text-slate-700">{contract.riskScore}%</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Badge variant={contract.status === 'analyzed' ? 'default' : 'secondary'} className="capitalize text-xs">
                      {contract.status}
                    </Badge>
                    {onDeleteContract && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 sm:p-0 touch-manipulation"
                        onClick={(e) => handleDeleteClick(e, contract.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 h-8 px-2 text-xs sm:text-sm touch-manipulation">
                    View
                    <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="mx-4 max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Contract
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{getContractName(contractToDelete || '')}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} className="flex-1 sm:flex-none">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

