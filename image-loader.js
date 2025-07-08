export default function imageLoader({ src, width, quality }) {
  const params = [`w_${width}`, `q_${quality || 75}`, "f_auto"]
  return `${src}?${params.join("&")}`
}
