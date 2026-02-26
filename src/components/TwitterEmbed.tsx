'use client'

import { TwitterTweetEmbed } from 'react-twitter-embed'

export default function TwitterEmbed({ url }: { url: string }) {
  const tweetId = url.split('/status/')[1]?.split('?')[0]

  if (!tweetId) return null

  return (
    <div className="my-6 w-full">
      <TwitterTweetEmbed tweetId={tweetId} />
    </div>
  )
}
