import { useState, useRef, useEffect } from 'react'

interface TagSelectorProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onAddOption?: (option: string) => void
  onRemoveOption?: (option: string) => void
}

const TagSelector = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "選択または入力してください",
  onAddOption,
  onRemoveOption
}: TagSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleAddNew = () => {
    if (searchQuery.trim() && !options.includes(searchQuery.trim())) {
      const newOption = searchQuery.trim()
      onAddOption?.(newOption)
      onChange(newOption)
      setSearchQuery('')
      setIsOpen(false)
    }
  }



  const handleRemove = (option: string) => {
    if (confirm(`「${option}」を削除しますか？`)) {
      onRemoveOption?.(option)
      if (value === option) {
        onChange('')
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Selected Value Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          backgroundColor: 'white',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '48px'
        }}
      >
        {value ? (
          <span style={{
            backgroundColor: '#e0e7ff',
            color: '#3730a3',
            padding: '0.25rem 0.75rem',
            borderRadius: '16px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {value}
          </span>
        ) : (
          <span style={{ color: '#9ca3af' }}>{placeholder}</span>
        )}
        <span style={{ color: '#6b7280' }}>▼</span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {/* Search Input */}
          <div style={{ padding: '0.5rem' }}>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索または新規追加..."
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (searchQuery.trim()) {
                    handleAddNew()
                  }
                }
                if (e.key === 'Escape') {
                  setIsOpen(false)
                  setSearchQuery('')
                }
              }}
              autoFocus
            />
          </div>

          {/* Options List */}
          <div>
            {filteredOptions.map((option) => (
              <div
                key={option}
                style={{
                  padding: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #f3f4f6'
                }}
              >
                <span
                  onClick={() => handleSelect(option)}
                  style={{
                    flex: 1,
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: value === option ? '#e0e7ff' : 'transparent',
                    color: value === option ? '#3730a3' : '#374151'
                  }}
                >
                  {option}
                </span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemove(option)
                    }}
                    style={{
                      padding: '0.25rem',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#ef4444',
                      fontSize: '0.75rem'
                    }}
                    title="削除"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Option */}
            {searchQuery.trim() && !options.includes(searchQuery.trim()) && (
              <div
                onClick={handleAddNew}
                style={{
                  padding: '0.5rem',
                  cursor: 'pointer',
                  color: '#4f46e5',
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>➕</span>
                <span>「{searchQuery}」を追加</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TagSelector