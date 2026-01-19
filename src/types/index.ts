// Database model types (matching Prisma schema)
export type ThreadStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED'

export interface User {
  id: string
  email: string
  name: string | null
  username: string | null
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Thread {
  id: string
  userId: string
  title: string | null
  status: ThreadStatus
  scheduledFor: Date | null
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  tweets: Tweet[]
}

export interface Tweet {
  id: string
  threadId: string
  content: string
  order: number
  media: MediaData | null
  pollData: PollData | null
  createdAt: Date
  updatedAt: Date
}

export interface MediaData {
  urls: string[]
  types: string[] // 'image' | 'video' | 'gif'
}

export interface PollData {
  question: string
  options: string[]
  duration: number // in hours
}

// Client-side types
export interface ComposerTweet {
  id: string
  content: string
  order: number
  mediaUrls?: string[]
}

export interface ComposerState {
  tweets: ComposerTweet[]
  threadId: string | null
  isSaving: boolean
  lastSaved: Date | null
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface SaveThreadRequest {
  title?: string
  tweets: {
    id?: string
    content: string
    order: number
    media?: MediaData
  }[]
}

export interface SaveThreadResponse {
  thread: Thread
}

export interface ScheduleThreadRequest {
  threadId: string
  scheduledFor: Date
}

export interface PublishThreadRequest {
  threadId: string
}
