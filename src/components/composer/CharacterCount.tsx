import React from 'react'
import { cn } from '@/lib/utils'

interface CharacterCountProps {
  count: number
  maxCount?: number
  className?: string
}

export function CharacterCount({ count, maxCount = 280, className }: CharacterCountProps) {
  const remaining = maxCount - count
  const percentage = (count / maxCount) * 100

  // Color based on remaining characters
  const getColor = () => {
    if (remaining < 0) return 'text-red-500'
    if (remaining <= 20) return 'text-orange-500'
    if (remaining <= 50) return 'text-yellow-600'
    return 'text-muted-foreground'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Circular progress indicator */}
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 transform -rotate-90">
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-200"
          />
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn(
              'transition-all',
              remaining < 0 ? 'text-red-500' :
              remaining <= 20 ? 'text-orange-500' :
              remaining <= 50 ? 'text-yellow-600' :
              'text-primary'
            )}
            strokeDasharray={`${Math.min(percentage, 100) * 0.88} 88`}
            strokeLinecap="round"
          />
        </svg>
        {remaining <= 20 && (
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center text-xs font-medium',
              getColor()
            )}
          >
            {remaining}
          </span>
        )}
      </div>

      {/* Text count for when over limit */}
      {remaining < 0 && (
        <span className="text-xs font-medium text-red-500">
          {Math.abs(remaining)} characters over limit
        </span>
      )}
    </div>
  )
}
