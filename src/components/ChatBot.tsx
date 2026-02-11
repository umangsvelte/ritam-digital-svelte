'use client'

import { useEffect, useState, useRef } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot() {
  const [open, setOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  // Auto greeting when opened
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: '👋 Hi! How can I help you today?',
      },
    ])
  }, [])

  useEffect(() => {
    if (messagesRef.current) {
        messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight
    }
    }, [messages, loading])

// Basic send message function (without streaming)

//   const sendMessage = async () => {
//     if (!input.trim()) return

//     const newMessages: Message[] = [
//       ...messages,
//       { role: 'user', content: input },
//     ]

//     setMessages(newMessages)
//     setInput('')
//     setLoading(true)

//     const res = await fetch('/api/chat', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ messages: newMessages }),
//     })

//     const data = await res.json()

//     setMessages([
//       ...newMessages,
//       { role: 'assistant', content: data.reply },
//     ])

//     setLoading(false)
//   }

// Streaming response handling

const sendMessage = async () => {
  if (!input.trim()) return

  const userMessage: Message = {
    role: 'user',
    content: input,
  }

  const updatedMessages = [...messages, userMessage]
  setMessages(updatedMessages)
  setInput('')
  setLoading(true)

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: updatedMessages }),
  })

  if (!res.body) {
    setLoading(false)
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  let assistantContent = ''

  // Push empty assistant message first
  setMessages(prev => [
    ...prev,
    { role: 'assistant', content: '' },
  ])

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    assistantContent += chunk

    // Update last assistant message live
    setMessages(prev => {
      const newMessages = [...prev]
      newMessages[newMessages.length - 1] = {
        role: 'assistant',
        content: assistantContent,
      }
      return newMessages
    })
  }

  setLoading(false)
}


  if (!open) return null

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[420px] bg-white border shadow-lg rounded-lg flex flex-col">
      <div className="p-3 bg-[#ef7f1b] text-white font-semibold flex justify-between">
        Chatbot
        <button onClick={() => setOpen(false)}>✕</button>
      </div>

      <div ref={messagesRef} className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
        {messages.map((msg, i) => (
        <div key={i}
            className={`p-2 rounded break-words whitespace-pre-wrap ${
                msg.role === 'assistant'
                ? 'bg-gray-100'
                : 'bg-[#ef7f1b] text-white self-end'
            }`}
            >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">Thinking…</div>}
      </div>

      <div className="flex border-t">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-3 py-2 outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-[#ef7f1b] text-white"
        >
          Send
        </button>
      </div>
    </div>
  )
}
