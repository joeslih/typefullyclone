'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { DraftCard } from '@/components/drafts/DraftCard'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import type { Thread } from '@/types'

export default function DraftsPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchThreads = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/threads')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch threads')
      }

      setThreads(data.data || [])
    } catch (err) {
      console.error('Error fetching threads:', err)
      setError(err instanceof Error ? err.message : 'Failed to load drafts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchThreads()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/threads/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete thread')
      }

      // Remove from local state
      setThreads(threads.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error deleting thread:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete draft')
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Drafts</h1>
            <p className="text-muted-foreground mt-1">
              {threads.length} saved {threads.length === 1 ? 'draft' : 'drafts'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchThreads} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link href="/compose">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Thread
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Loading drafts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchThreads}>Try Again</Button>
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-2">No drafts yet</h2>
              <p className="text-muted-foreground mb-6">
                Start creating your first thread draft
              </p>
              <Link href="/compose">
                <Button size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Draft
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {threads.map(thread => (
              <DraftCard
                key={thread.id}
                thread={thread}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
