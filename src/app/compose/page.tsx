'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ThreadComposer } from '@/components/composer/ThreadComposer'
import { useComposerStore } from '@/stores/composerStore'

function ComposeContent() {
  const searchParams = useSearchParams()
  const draftId = searchParams.get('draft')
  const { loadThread, clearComposer } = useComposerStore()

  useEffect(() => {
    // Load draft if ID is provided
    if (draftId) {
      const loadDraft = async () => {
        try {
          const response = await fetch(`/api/threads/${draftId}`)
          const data = await response.json()

          if (data.success && data.data) {
            loadThread(data.data)
          } else {
            console.error('Failed to load draft:', data.error)
            alert('Failed to load draft')
          }
        } catch (error) {
          console.error('Error loading draft:', error)
          alert('Failed to load draft')
        }
      }

      loadDraft()
    } else {
      // Clear composer for new thread
      clearComposer()
    }
  }, [draftId, loadThread, clearComposer])

  return <ThreadComposer />
}

export default function ComposePage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <ComposeContent />
      </Suspense>
    </div>
  )
}
