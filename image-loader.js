export default function myImageLoader({ src, width, quality }) {
  const params = [`w_${width}`, `q_${quality || 75}`]
  return `${src}?${params.join(",")}`
}
