export default function imageLoader({ src, width, quality }) {
  // For static export, just return the src as-is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src
  }
  return src
}
