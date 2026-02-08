import * as React from "react"
import { X } from "lucide-react"

interface SheetProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sheet({ children, open: controlledOpen, onOpenChange }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  
  const onOpenChangeValue = React.useCallback((newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen)
    } else {
      setUncontrolledOpen(newOpen)
    }
  }, [isControlled, onOpenChange])
  
  const onClose = React.useCallback(() => {
    onOpenChangeValue(false)
  }, [onOpenChangeValue])
  
  // Find children and pass open/close handlers
  const childrenArray = React.Children.toArray(children)
  
  return (
    <>
      {childrenArray.map((child, index) => {
        if (React.isValidElement(child)) {
          // First child is typically the Trigger
          if (index === 0 && child.type === SheetTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, {
              open,
              onOpen: () => onOpenChangeValue(true),
              onClose
            })
          }
          // Other children (Content)
          return React.cloneElement(child as React.ReactElement<any>, {
            open,
            onClose
          })
        }
        return child
      })}
    </>
  )
}

interface SheetTriggerProps {
  children: React.ReactNode
  open?: boolean
  onOpen?: () => void
  onClose?: () => void
  asChild?: boolean
}

export function SheetTrigger({ children, open, onOpen, onClose }: SheetTriggerProps) {
  const handleClick = () => {
    if (open) {
      onClose?.()
    } else {
      onOpen?.()
    }
  }
  
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as any).props?.onClick?.(e)
        handleClick()
      }
    })
  }
  
  return <div onClick={handleClick}>{children}</div>
}

export function SheetClose({ children, onClick, className = "" }: { children?: React.ReactNode; onClick?: () => void; className?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.()
  }
  
  return (
    <button
      onClick={handleClick}
      className={`rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none ${className}`}
    >
      {children || <X className="h-4 w-4" />}
      <span className="sr-only">Close</span>
    </button>
  )
}

interface SheetContentProps {
  children: React.ReactNode
  open?: boolean
  onClose?: () => void
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function SheetContent({ children, open, onClose, side = "right", className = "" }: SheetContentProps) {
  const sideClasses = {
    right: "inset-y-0 right-0 h-full w-[280px] sm:w-[320px] border-l",
    left: "inset-y-0 left-0 h-full w-[280px] sm:w-[320px] border-r",
    top: "inset-x-0 top-0 border-b h-auto",
    bottom: "inset-x-0 bottom-0 border-t h-auto",
  }

  if (!open) {
    return null
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/80" 
        onClick={onClose}
      />
      {/* Content */}
      <div
        className={`fixed z-50 gap-4 bg-background p-6 shadow-lg overflow-y-auto ${sideClasses[side]} ${className}`}
      >
        <SheetClose className="absolute right-4 top-4" onClick={onClose} />
        {children}
      </div>
    </>
  )
}
