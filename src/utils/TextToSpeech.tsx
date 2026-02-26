'use client'

import { useEffect, useState } from 'react'

export default function TextToSpeech({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) setVoices(v)
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const getBestVoice = () => {
    // Priority 1: Indian English
    let voice =
      voices.find(v => v.lang === 'en-IN') ||

      // Priority 2: Any English India variant
      voices.find(v => v.lang.includes('IN')) ||

      // Priority 3: Good English voice
      voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||

      // Priority 4: Any English
      voices.find(v => v.lang.startsWith('en'))

    return voice
  }

  const speakChunk = (chunk: string) => {
    const utterance = new SpeechSynthesisUtterance(chunk)

    const selectedVoice = getBestVoice()
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    utterance.rate = 0.9   // slower = clearer
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const speak = () => {
    if (!text) return

    window.speechSynthesis.cancel()

    // Split into smaller readable chunks
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text]

    sentences.forEach(sentence => {
      speakChunk(sentence.trim())
    })
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  return (
    <div style={{ margin: '20px 0' }}>
      {!isSpeaking ? (
        <button onClick={speak}>
          🔊 Listen to Audio
        </button>
      ) : (
        <button onClick={stop}>
          ⏹ Stop
        </button>
      )}
    </div>
  )
}