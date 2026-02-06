import * as React from "react"

export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string
    title: string
    description?: string
    variant?: "default" | "destructive"
  }>>([])

  const toast = ({ title, description, variant = "default" }: {
    title: string
    description?: string
    variant?: "default" | "destructive"
  }) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, title, description, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  return { toast, toasts }
}

