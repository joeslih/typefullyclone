'use client'

import React from 'react'
import { TwitterTweetPreview } from './TwitterTweetPreview'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ComposerTweet } from '@/types'

interface ThreadPreviewProps {
  tweets: ComposerTweet[]
  userName?: string
  userHandle?: string
  userAvatar?: string
}

export function ThreadPreview({
  tweets,
  userName = 'Your Name',
  userHandle = 'yourhandle',
  userAvatar,
}: ThreadPreviewProps) {
  // Filter out empty tweets for preview
  const visibleTweets = tweets.filter(tweet => tweet.content.trim())

  return (
    <div className="w-full h-full">
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Live Preview</CardTitle>
          <CardDescription>
            See how your thread will look on Twitter/X
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {visibleTweets.length > 0 ? (
            <div className="space-y-0">
              {visibleTweets.map((tweet, index) => (
                <TwitterTweetPreview
                  key={tweet.id}
                  content={tweet.content}
                  order={index}
                  isLast={index === visibleTweets.length - 1}
                  userName={userName}
                  userHandle={userHandle}
                  userAvatar={userAvatar}
                  className={index > 0 ? 'border-t-0 rounded-t-none' : ''}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <p className="text-muted-foreground mb-2">
                  Your thread preview will appear here
                </p>
                <p className="text-sm text-muted-foreground">
                  Start typing to see how your tweets will look
                </p>
              </div>
            </div>
          )}

          {visibleTweets.length > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{visibleTweets.length}</span> tweet{visibleTweets.length !== 1 ? 's' : ''} in this thread
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
