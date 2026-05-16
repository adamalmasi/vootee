'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import SharePanel from '@/components/SharePanel'

function ShareContent() {
  const params = useSearchParams()
  const voteLink = params.get('vote') ?? ''
  const adminLink = params.get('admin') ?? ''
  return <SharePanel voteLink={voteLink} adminLink={adminLink} />
}

export default function SharePage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Szavazás kész! 🎉</h1>
      <Suspense><ShareContent /></Suspense>
    </main>
  )
}
