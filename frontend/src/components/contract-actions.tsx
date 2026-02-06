import { Button } from '@/components/ui/button'
import { Download, Share2, FileText, Trash2 } from 'lucide-react'

interface ContractActionsProps {
  onExport: () => void
  onShare: () => void
  onPrint: () => void
  onDelete: () => void
}

export default function ContractActions({ onExport, onShare, onPrint, onDelete }: ContractActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
        <Download size={16} />
        Export Report
      </Button>
      <Button variant="outline" size="sm" onClick={onShare} className="gap-2">
        <Share2 size={16} />
        Share
      </Button>
      <Button variant="outline" size="sm" onClick={onPrint} className="gap-2">
        <FileText size={16} />
        Print
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
        <Trash2 size={16} />
        Delete
      </Button>
    </div>
  )
}

