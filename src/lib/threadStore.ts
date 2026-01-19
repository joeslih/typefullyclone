// Temporary in-memory storage for threads
// This will be replaced with Prisma once the database is fully configured

import type { Thread, Tweet } from '@/types'

interface StoredThread extends Omit<Thread, 'createdAt' | 'updatedAt' | 'scheduledFor' | 'publishedAt'> {
  createdAt: string
  updatedAt: string
  scheduledFor: string | null
  publishedAt: string | null
}

// In-memory store (will be replaced with database)
const threads: Map<string, StoredThread> = new Map()

// Mock user ID (replace with real auth later)
const MOCK_USER_ID = 'user_mock_123'

export const threadStore = {
  // Create a new thread
  create: (data: { title?: string; tweets: Omit<Tweet, 'id' | 'createdAt' | 'updatedAt' | 'threadId'>[] }): StoredThread => {
    const id = `thread_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const now = new Date().toISOString()

    const tweets: Tweet[] = data.tweets.map((tweet, index) => ({
      id: `tweet_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 9)}`,
      threadId: id,
      content: tweet.content,
      order: tweet.order,
      media: tweet.media,
      pollData: tweet.pollData,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    }))

    const thread: StoredThread = {
      id,
      userId: MOCK_USER_ID,
      title: data.title || null,
      status: 'DRAFT',
      scheduledFor: null,
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
      tweets,
    }

    threads.set(id, thread)
    return thread
  },

  // Get all threads for user
  findMany: (): StoredThread[] => {
    return Array.from(threads.values())
      .filter(t => t.userId === MOCK_USER_ID)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  // Get thread by ID
  findById: (id: string): StoredThread | null => {
    return threads.get(id) || null
  },

  // Update thread
  update: (id: string, data: { title?: string; tweets: Omit<Tweet, 'id' | 'createdAt' | 'updatedAt' | 'threadId'>[] }): StoredThread | null => {
    const existing = threads.get(id)
    if (!existing) return null

    const now = new Date().toISOString()

    const tweets: Tweet[] = data.tweets.map((tweet, index) => ({
      id: `id` in tweet && tweet.id ? (tweet as any).id : `tweet_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 9)}`,
      threadId: id,
      content: tweet.content,
      order: tweet.order,
      media: tweet.media,
      pollData: tweet.pollData,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    }))

    const updated: StoredThread = {
      ...existing,
      title: data.title !== undefined ? data.title : existing.title,
      tweets,
      updatedAt: now,
    }

    threads.set(id, updated)
    return updated
  },

  // Delete thread
  delete: (id: string): boolean => {
    return threads.delete(id)
  },
}
