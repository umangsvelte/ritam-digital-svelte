//             normal api call for LLM
// import { NextResponse } from 'next/server'

// export async function POST(req: Request) {
//   const { messages } = await req.json()

//   const response = await fetch('http://localhost:11434/api/chat', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: 'phi3:mini',
//       messages,
//       stream: false,
//     }),
//   })

//   const data = await response.json()

//   return NextResponse.json({
//     reply: data.message.content,
//   })
// }


//       streaming api call for LLM    

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const ollamaRes = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'phi3:mini',
      messages,
      options: {
        num_predict: 512,
        temperature: 0.2,
        top_p: 0.9,
      },
      stream: true,
    }),
  })

  if (!ollamaRes.body) {
    return NextResponse.json(
      { error: 'No response body from Ollama' },
      { status: 500 }
    )
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream({
    async start(controller) {
      const reader = ollamaRes.body!.getReader()

      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n').filter(Boolean)

          for (const line of lines) {
            const json = JSON.parse(line)

            if (json.message?.content) {
              controller.enqueue(
                encoder.encode(json.message.content)
              )
            }

            if (json.done) {
              controller.close()
              return
            }
          }
        }
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
