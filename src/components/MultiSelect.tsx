'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface MultiSelectProps {
  options: { label: string; value: string }[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
}

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select...',
  className = ''
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onChange(newValues)
  }

  const selectedLabels = options
    .filter(opt => selectedValues.includes(opt.value))
    .map(opt => opt.label)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-accent-gold bg-white flex items-center justify-between min-h-[30px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="truncate pr-2">
          {selectedValues.length === 0 
            ? <span className="text-gray-400">{placeholder}</span>
            : <span className="text-primary-black">{selectedLabels.join(', ')}</span>}
        </div>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value)
            return (
              <div
                key={option.value}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 text-xs"
                onClick={() => toggleOption(option.value)}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 ${isSelected ? 'bg-accent-gold border-accent-gold' : 'border-gray-300'}`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={isSelected ? 'font-medium text-primary-black' : 'text-gray-600'}>
                  {option.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
