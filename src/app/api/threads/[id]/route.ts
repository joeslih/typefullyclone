import { NextRequest, NextResponse } from 'next/server'
import { threadStore } from '@/lib/threadStore'
import type { SaveThreadRequest } from '@/types'

// GET /api/threads/[id] - Get specific thread
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const thread = threadStore.findById(id)

    if (!thread) {
      return NextResponse.json(
        { success: false, error: 'Thread not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: thread })
  } catch (error) {
    console.error('Error fetching thread:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch thread' },
      { status: 500 }
    )
  }
}

// PUT /api/threads/[id] - Update thread
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const thread = threadStore.update(id, {
      title: body.title,
      tweets: validTweets,
    })

    if (!thread) {
      return NextResponse.json(
        { success: false, error: 'Thread not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: thread })
  } catch (error) {
    console.error('Error updating thread:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update thread' },
      { status: 500 }
    )
  }
}

// DELETE /api/threads/[id] - Delete thread
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = threadStore.delete(id)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Thread not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting thread:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete thread' },
      { status: 500 }
    )
  }
}
