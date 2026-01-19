'use client'

import { useEffect, useState } from 'react'
import { useComposerStore } from '@/stores/composerStore'

export default function DiagnosticPage() {
  const store = useComposerStore()
  const [apiStatus, setApiStatus] = useState('Testing...')
  const [threads, setThreads] = useState<any[]>([])

  useEffect(() => {
    // Test API
    fetch('/api/threads')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApiStatus('✅ API Working')
          setThreads(data.data || [])
        } else {
          setApiStatus('❌ API Error: ' + data.error)
        }
      })
      .catch(err => {
        setApiStatus('❌ API Failed: ' + err.message)
      })
  }, [])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Diagnostic Page</h1>

        {/* API Status */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold mb-2">API Status</h2>
          <p>{apiStatus}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Threads in database: {threads.length}
          </p>
        </div>

        {/* Zustand Store */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold mb-2">Zustand Store Status</h2>
          <p>Tweets in store: {store.tweets.length}</p>
          <p>Thread ID: {store.threadId || 'null'}</p>
          <p>Is Saving: {store.isSaving ? 'Yes' : 'No'}</p>
          <pre className="text-xs mt-2 bg-muted p-2 rounded overflow-auto">
            {JSON.stringify(store.tweets, null, 2)}
          </pre>
        </div>

        {/* Threads from API */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold mb-2">Saved Threads</h2>
          {threads.length === 0 ? (
            <p className="text-muted-foreground">No threads saved yet</p>
          ) : (
            <ul className="space-y-2">
              {threads.map(thread => (
                <li key={thread.id} className="border p-2 rounded">
                  <p className="font-semibold">{thread.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {thread.tweets?.length || 0} tweets
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Browser Info */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold mb-2">Browser Info</h2>
          <p>User Agent: {navigator.userAgent}</p>
          <p>Window dimensions: {window.innerWidth}x{window.innerHeight}</p>
        </div>
      </div>
    </div>
  )
}
