"use client"

import { useState, useRef, useEffect } from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiSelectFilterProps {
  label?: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  triggerClassName?: string
  compact?: boolean
}

export function MultiSelectFilter({
  label,
  options,
  selected,
  onChange,
  placeholder = "All",
  className,
  triggerClassName,
  compact = false,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Prune selected values that are no longer in the available options
  useEffect(() => {
    if (selected.length > 0) {
      const valid = selected.filter((s) => options.includes(s))
      if (valid.length !== selected.length) {
        onChange(valid)
      }
    }
  }, [options, selected, onChange])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const allSelected = selected.length === 0 || selected.length === options.length
  const noneSelected = selected.length === 0

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      // Removing this option
      const next = selected.filter((s) => s !== option)
      // If removing leaves empty, that means "all"
      onChange(next)
    } else {
      // Adding this option
      const next = [...selected, option]
      // If all are now selected, reset to empty (meaning "all")
      if (next.length === options.length) {
        onChange([])
      } else {
        onChange(next)
      }
    }
  }

  const selectAll = () => {
    onChange([])
  }

  const displayText = allSelected
    ? placeholder
    : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`

  return (
    <div className={cn("relative", className)} ref={ref}>
      {label && (
        <label className={cn("text-muted-foreground block mb-1.5", compact ? "text-xs" : "text-sm")}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between w-full rounded-md border border-border bg-secondary px-3 text-left text-foreground",
          compact ? "h-8 text-sm" : "h-9 text-sm",
          triggerClassName,
        )}
      >
        <span className={cn("truncate", allSelected ? "text-muted-foreground" : "text-foreground")}>
          {displayText}
        </span>
        <div className="flex items-center gap-1 ml-1 shrink-0">
          {!allSelected && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                selectAll()
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation()
                  selectAll()
                }
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-md">
          <div className="max-h-56 overflow-y-auto p-1">
            {/* All option */}
            <button
              type="button"
              onClick={selectAll}
              className={cn(
                "flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                allSelected ? "text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              <div className={cn(
                "flex h-4 w-4 items-center justify-center rounded-sm border",
                allSelected ? "border-primary bg-primary text-primary-foreground" : "border-border",
              )}>
                {allSelected && <Check className="h-3 w-3" />}
              </div>
              All
            </button>

            {/* Individual options */}
            {options.map((option) => {
              const isChecked = !noneSelected && selected.includes(option)
              // When "all" (empty array), show all as checked
              const isActive = allSelected || isChecked

              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={cn(
                    "flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border",
                    isActive ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}>
                    {isActive && <Check className="h-3 w-3" />}
                  </div>
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
