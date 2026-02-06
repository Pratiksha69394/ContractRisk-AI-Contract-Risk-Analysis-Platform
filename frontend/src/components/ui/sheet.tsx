import * as React from "react"
import { X } from "lucide-react"

interface SheetProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sheet({ children, open, onOpenChange }: SheetProps) {
  return <>{children}</>
}

interface SheetTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  onClick?: () => void
}

export function SheetTrigger({ children, onClick }: SheetTriggerProps) {
  return <div onClick={onClick}>{children}</div>
}

export function SheetClose({ children, onClick }: { children?: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
    >
      {children || <X className="h-4 w-4" />}
      <span className="sr-only">Close</span>
    </button>
  )
}

interface SheetContentProps {
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function SheetContent({ children, side = "right", className = "" }: SheetContentProps) {
  const sideClasses = {
    right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    top: "inset-x-0 top-0 border-b h-auto",
    bottom: "inset-x-0 bottom-0 border-t h-auto",
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/80" />
      {/* Content */}
      <div
        className={`fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out overflow-y-auto ${sideClasses[side]} ${className}`}
      >
        {children}
      </div>
    </>
  )
}
