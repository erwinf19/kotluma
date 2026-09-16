export function collapseProgress(scrollY, expandedHeight, collapsedHeight) {
  const range = Math.max(0, expandedHeight - collapsedHeight)
  const offset = Math.max(0, Math.min(range, Number(scrollY) || 0))
  return { range, offset, progress: range ? offset / range : 0 }
}
