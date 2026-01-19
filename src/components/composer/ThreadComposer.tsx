'use client'

import React from 'react'
import { useComposerStore } from '@/stores/composerStore'
import { TweetInput } from './TweetInput'
import { Button } from '@/components/ui/button'
import { Plus, Save, Calendar } from 'lucide-react'

export function ThreadComposer() {
  const {
    tweets,
    addTweet,
    updateTweet,
    deleteTweet,
    isSaving,
  } = useComposerStore()

  const canAddMore = tweets.length < 25

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving thread...', tweets)
  }

  const handleSchedule = () => {
    // TODO: Implement schedule modal
    console.log('Opening schedule modal...')
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
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
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
        </div>
      </div>

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
  )
}
