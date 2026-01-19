'use client'

import React, { useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CharacterCount } from './CharacterCount'
import { Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ComposerTweet } from '@/types'

interface TweetInputProps {
  tweet: ComposerTweet
  index: number
  totalTweets: number
  onUpdate: (id: string, content: string) => void
  onDelete: (id: string) => void
  autoFocus?: boolean
  className?: string
}

export function TweetInput({
  tweet,
  index,
  totalTweets,
  onUpdate,
  onDelete,
  autoFocus = false,
  className,
}: TweetInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [tweet.content])

  // Auto-focus if specified
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(tweet.id, e.target.value)
  }

  const canDelete = totalTweets > 1

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex gap-3">
        {/* Drag handle */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <button
            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          <span className="text-xs text-muted-foreground font-medium">
            {index + 1}
          </span>
        </div>

        {/* Content area */}
        <div className="flex-1 space-y-3">
          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={tweet.content}
            onChange={handleChange}
            placeholder={index === 0 ? "What's happening?" : "Add another tweet..."}
            className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
          />

          {/* Actions bar */}
          <div className="flex items-center justify-between pt-2 border-t">
            {/* Character count */}
            <CharacterCount count={tweet.content.length} />

            {/* Delete button */}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(tweet.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
