import { NextRequest, NextResponse } from 'next/server'
import { threadStore } from '@/lib/threadStore'
import type { SaveThreadRequest } from '@/types'

// GET /api/threads - List all threads
export async function GET() {
  try {
    const threads = threadStore.findMany()
    return NextResponse.json({ success: true, data: threads })
  } catch (error) {
    console.error('Error fetching threads:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch threads' },
      { status: 500 }
    )
  }
}

// POST /api/threads - Create new thread
export async function POST(request: NextRequest) {
  try {
    const body: SaveThreadRequest = await request.json()

    // Validate request
    if (!body.tweets || body.tweets.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one tweet is required' },
        { status: 400 }
      )
    }

    // Filter out empty tweets
    const validTweets = body.tweets
      .filter(t => t.content.trim())
      .map(t => ({
        content: t.content,
        order: t.order,
        media: t.media || null,
        pollData: t.pollData || null,
      }))

    if (validTweets.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one non-empty tweet is required' },
        { status: 400 }
      )
    }

    const thread = threadStore.create({
      title: body.title,
      tweets: validTweets,
    })

    return NextResponse.json({ success: true, data: thread })
  } catch (error) {
    console.error('Error creating thread:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create thread' },
      { status: 500 }
    )
  }
}
