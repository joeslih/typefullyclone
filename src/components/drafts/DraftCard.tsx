'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Calendar, MessageSquare } from 'lucide-react'
import type { Thread } from '@/types'

interface DraftCardProps {
  thread: Thread
  onDelete: (id: string) => void
}

export function DraftCard({ thread, onDelete }: DraftCardProps) {
  const tweetCount = thread.tweets.length
  const preview = thread.tweets[0]?.content || 'Empty thread'
  const previewText = preview.length > 150 ? preview.substring(0, 150) + '...' : preview

  const updatedAt = typeof thread.updatedAt === 'string'
    ? new Date(thread.updatedAt)
    : thread.updatedAt

  const formattedDate = updatedAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this draft?')) {
      onDelete(thread.id)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {thread.title || 'Untitled Thread'}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {tweetCount} tweet{tweetCount !== 1 ? 's' : ''}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{previewText}</p>
        <div className="flex gap-2">
          <Link href={`/compose?draft=${thread.id}`} className="flex-1">
            <Button variant="default" className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
