export const getYoutubeId = (url?: string): string | null => {
  if (!url) return null

  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v')
    }
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace('/', '')
    }
    return null
  } catch {
    return null
  }
}
