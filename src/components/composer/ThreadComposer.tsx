'use client'

import React, { useState } from 'react'
import { useComposerStore } from '@/stores/composerStore'
import { TweetInput } from './TweetInput'
import { ThreadPreview } from '@/components/preview/ThreadPreview'
import { Button } from '@/components/ui/button'
import { Plus, Save, Calendar, Check } from 'lucide-react'
import type { SaveThreadRequest } from '@/types'

export function ThreadComposer() {
  const {
    tweets,
    threadId,
    addTweet,
    updateTweet,
    deleteTweet,
    isSaving,
    setThreadId,
    setIsSaving,
    setLastSaved,
  } = useComposerStore()

  const [saveSuccess, setSaveSuccess] = useState(false)
  const canAddMore = tweets.length < 25

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveSuccess(false)

      // Filter out empty tweets
      const validTweets = tweets.filter(t => t.content.trim())

      if (validTweets.length === 0) {
        alert('Please add at least one tweet with content')
        return
      }

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
      setSaveSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving thread:', error)
      alert(error instanceof Error ? error.message : 'Failed to save thread')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSchedule = () => {
    // TODO: Implement schedule modal
    console.log('Opening schedule modal...')
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Compose Thread</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSchedule}
            disabled={tweets.every(t => !t.content.trim())}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || tweets.every(t => !t.content.trim())}
            variant={saveSuccess ? 'default' : 'default'}
            className={saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : threadId ? 'Update Draft' : 'Save Draft'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main content: Composer and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composer column */}
        <div className="space-y-4">
          {/* Tweet inputs */}
          <div className="space-y-4">
            {tweets.map((tweet, index) => (
              <TweetInput
                key={tweet.id}
                tweet={tweet}
                index={index}
                totalTweets={tweets.length}
                onUpdate={updateTweet}
                onDelete={deleteTweet}
                autoFocus={index === tweets.length - 1 && tweets.length > 1}
              />
            ))}
          </div>

          {/* Add tweet button */}
          {canAddMore && (
            <Button
              variant="outline"
              onClick={addTweet}
              className="w-full"
              disabled={!tweets[tweets.length - 1]?.content.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tweet ({tweets.length}/25)
            </Button>
          )}

          {/* Status message */}
          {!canAddMore && (
            <p className="text-sm text-center text-muted-foreground">
              Maximum of 25 tweets reached
            </p>
          )}
        </div>

        {/* Preview column - sticky on desktop */}
        <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <ThreadPreview tweets={tweets} />
        </div>
      </div>
    </div>
  )
}
