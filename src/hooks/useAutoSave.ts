import { useEffect, useRef } from 'react'
import { useComposerStore } from '@/stores/composerStore'
import type { SaveThreadRequest } from '@/types'

interface UseAutoSaveOptions {
  enabled?: boolean
  delay?: number // milliseconds
  onSave?: () => void
  onError?: (error: Error) => void
}

export function useAutoSave({
  enabled = true,
  delay = 5000, // 5 seconds default
  onSave,
  onError,
}: UseAutoSaveOptions = {}) {
  const {
    tweets,
    threadId,
    setThreadId,
    setIsSaving,
    setLastSaved,
  } = useComposerStore()

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const tweetsRef = useRef(tweets)

  // Update ref when tweets change
  useEffect(() => {
    tweetsRef.current = tweets
  }, [tweets])

  useEffect(() => {
    if (!enabled) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Don't auto-save if no content
    const hasContent = tweets.some(t => t.content.trim())
    if (!hasContent) return

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true)

        // Filter out empty tweets
        const validTweets = tweets.filter(t => t.content.trim())

        if (validTweets.length === 0) return

        // Prepare request
        const request: SaveThreadRequest = {
          title: `Thread ${new Date().toLocaleDateString()}`,
          tweets: validTweets.map(t => ({
            content: t.content,
            order: t.order,
            media: t.mediaUrls && t.mediaUrls.length > 0
              ? { urls: t.mediaUrls, types: t.mediaUrls.map(() => 'image') }
              : undefined,
          })),
        }

        // Call API
        const url = threadId ? `/api/threads/${threadId}` : '/api/threads'
        const method = threadId ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to save thread')
        }

        // Update store with thread ID
        if (!threadId && data.data?.id) {
          setThreadId(data.data.id)
        }

        setLastSaved(new Date())
        onSave?.()
      } catch (error) {
        console.error('Auto-save error:', error)
        onError?.(error instanceof Error ? error : new Error('Auto-save failed'))
      } finally {
        setIsSaving(false)
      }
    }, delay)

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [tweets, threadId, enabled, delay, onSave, onError, setThreadId, setIsSaving, setLastSaved])

  return {
    cancel: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    },
  }
}
