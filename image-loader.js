export default function imageLoader({ src, width, quality }) {
  const params = new URLSearchParams()
  params.set("url", src)
  params.set("w", width.toString())
  if (quality) {
    params.set("q", quality.toString())
  }
  return `/_next/image?${params.toString()}`
}
