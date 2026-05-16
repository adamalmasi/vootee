'use client'
import { useState } from 'react'

type Props = { voteLink: string; adminLink: string }

export default function SharePanel({ voteLink, adminLink }: Props) {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(voteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const waText = encodeURIComponent(`Szavazz az időpontra: ${voteLink}`)

  return (
    <div className="space-y-5">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">Szavazás linkje</div>
        <div className="flex gap-2">
          <input readOnly value={voteLink} className="flex-1 text-sm border rounded-lg px-3 py-2 bg-white" />
          <button onClick={copyLink} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold text-sm px-4 rounded-lg">
            {copied ? '✓ Másolva' : 'Másolás'}
          </button>
        </div>
      </div>
      <div className="flex gap-3">
        <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer"
          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold text-center py-2.5 rounded-lg">
          WhatsApp
        </a>
        <a href={`mailto:?subject=Időpont-szavazás&body=${waText}`}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold text-center py-2.5 rounded-lg">
          Email
        </a>
      </div>
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
        <strong className="text-gray-700">Admin link (csak neked):</strong>{' '}
        <a href={adminLink} className="text-blue-500 break-all">{adminLink}</a>
      </div>
    </div>
  )
}
