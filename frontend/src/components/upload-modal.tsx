import { useState, type DragEvent, type ChangeEvent } from 'react'
import { FileText, Upload, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File, contractId: string) => Promise<void>
}

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (selectedFile) {
      const contractId = crypto.randomUUID()
      await onUpload(selectedFile, contractId)
      setSelectedFile(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Upload className="h-5 w-5" />
            Upload Contract
          </DialogTitle>
          <DialogDescription className="text-sm">
            Upload a contract document for AI-powered risk analysis
          </DialogDescription>
        </DialogHeader>

        <div
          className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors touch-manipulation ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FileText className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-slate-600 mb-2">
            Drag and drop your contract file here, or{' '}
            <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
              browse
              <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
            </label>
          </p>
          <p className="text-xs sm:text-sm text-slate-500">Supports PDF, DOCX, and TXT files</p>

          {selectedFile && (
            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
              <p className="text-sm font-medium text-slate-700 truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700">
            Analyze Contract
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

