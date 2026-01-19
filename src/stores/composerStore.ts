import { create } from 'zustand'
import type { ComposerTweet, Thread } from '@/types'

interface ComposerState {
  tweets: ComposerTweet[]
  threadId: string | null
  isSaving: boolean
  lastSaved: Date | null

  // Actions
  addTweet: () => void
  updateTweet: (id: string, content: string) => void
  deleteTweet: (id: string) => void
  reorderTweets: (startIndex: number, endIndex: number) => void
  loadThread: (thread: Thread) => void
  clearComposer: () => void
  setThreadId: (id: string | null) => void
  setIsSaving: (saving: boolean) => void
  setLastSaved: (date: Date) => void
}

// Generate a unique ID for client-side tweets
const generateId = () => `tweet_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

export const useComposerStore = create<ComposerState>((set, get) => ({
  tweets: [
    { id: generateId(), content: '', order: 0 } // Start with one empty tweet
  ],
  threadId: null,
  isSaving: false,
  lastSaved: null,

  addTweet: () => {
    const { tweets } = get()

    // Limit to 25 tweets (Twitter's thread limit)
    if (tweets.length >= 25) {
      return
    }

    const newTweet: ComposerTweet = {
      id: generateId(),
      content: '',
      order: tweets.length,
    }

    set({ tweets: [...tweets, newTweet] })
  },

  updateTweet: (id: string, content: string) => {
    set((state) => ({
      tweets: state.tweets.map((tweet) =>
        tweet.id === id ? { ...tweet, content } : tweet
      ),
    }))
  },

  deleteTweet: (id: string) => {
    set((state) => {
      const newTweets = state.tweets.filter((tweet) => tweet.id !== id)

      // Don't allow deleting the last tweet - always keep at least one
      if (newTweets.length === 0) {
        return state
      }

      // Recalculate order after deletion
      return {
        tweets: newTweets.map((tweet, index) => ({
          ...tweet,
          order: index,
        })),
      }
    })
  },

  reorderTweets: (startIndex: number, endIndex: number) => {
    set((state) => {
      const result = Array.from(state.tweets)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)

      // Update order field
      return {
        tweets: result.map((tweet, index) => ({
          ...tweet,
          order: index,
        })),
      }
    })
  },

  loadThread: (thread: Thread) => {
    set({
      threadId: thread.id,
      tweets: thread.tweets.map((tweet) => ({
        id: tweet.id,
        content: tweet.content,
        order: tweet.order,
        mediaUrls: tweet.media?.urls || [],
      })),
      lastSaved: thread.updatedAt,
    })
  },

  clearComposer: () => {
    set({
      tweets: [{ id: generateId(), content: '', order: 0 }],
      threadId: null,
      isSaving: false,
      lastSaved: null,
    })
  },

  setThreadId: (id: string | null) => {
    set({ threadId: id })
  },

  setIsSaving: (saving: boolean) => {
    set({ isSaving: saving })
  },

  setLastSaved: (date: Date) => {
    set({ lastSaved: date })
  },
}))
