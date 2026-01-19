'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { MessageCircle, Repeat2, Heart, Share, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TwitterTweetPreviewProps {
  content: string
  order: number
  isLast: boolean
  userName?: string
  userHandle?: string
  userAvatar?: string
  className?: string
}

export function TwitterTweetPreview({
  content,
  order,
  isLast,
  userName = 'Your Name',
  userHandle = 'yourhandle',
  userAvatar,
  className,
}: TwitterTweetPreviewProps) {
  // Format timestamp (just show "now" for preview)
  const timestamp = 'now'

  // Default avatar if none provided
  const avatarUrl = userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1DA1F2&color=fff`

  return (
    <Card className={cn('p-4 relative', className)}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>

          {/* Thread line connector */}
          {!isLast && (
            <div className="w-0.5 bg-gray-300 dark:bg-gray-700 mx-auto mt-1" style={{ height: '100%', minHeight: '20px' }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-bold text-sm truncate">{userName}</span>
              <span className="text-muted-foreground text-sm truncate">@{userHandle}</span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">{timestamp}</span>
            </div>
            <button className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-accent">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Tweet content */}
          <div className="mt-1">
            {content ? (
              <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Start typing...</p>
            )}
          </div>

          {/* Thread indicator */}
          {order === 0 && (
            <div className="mt-3 text-xs text-blue-500 flex items-center gap-1">
              <span className="font-medium">Show this thread</span>
            </div>
          )}

          {/* Engagement buttons */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-500/10 group">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs group-hover:text-blue-500"></span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors p-1 rounded-full hover:bg-green-500/10 group">
              <Repeat2 className="w-4 h-4" />
              <span className="text-xs group-hover:text-green-500"></span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-500/10 group">
              <Heart className="w-4 h-4" />
              <span className="text-xs group-hover:text-red-500"></span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-500/10 group">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
