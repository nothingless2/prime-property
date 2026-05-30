'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onClose, 300) // Wait for transition
      }, duration)
      return () => clearTimeout(timer)
    } else {
      setShow(false)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible && !show) return null

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-lg border border-green-100 transition-all duration-300 transform ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <CheckCircle2 className="w-5 h-5 text-green-500" />
      <p className="text-sm font-medium text-primary-black">{message}</p>
      <button onClick={() => { setShow(false); setTimeout(onClose, 300) }} className="text-gray-400 hover:text-gray-600 transition ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
