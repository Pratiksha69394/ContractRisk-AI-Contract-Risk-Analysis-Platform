import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Upload } from 'lucide-react'

interface EmptyStateProps {
  onUploadClick: () => void
}

export default function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <FileText className="w-12 h-12 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">No Contracts Yet</h2>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Upload your first contract to get AI-powered risk analysis and insights. Identify potential legal, financial, and compliance risks instantly.
      </p>
      <Button
        onClick={onUploadClick}
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        size="lg"
      >
        <Upload size={20} />
        Upload Your First Contract
      </Button>
    </div>
  )
}

