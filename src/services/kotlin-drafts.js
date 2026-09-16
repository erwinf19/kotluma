export const kotlinStyles = ['binding', 'traditional']

export function kotlinExample(lesson, style) {
  return style === 'traditional' ? lesson.traditionalKotlin : lesson.kotlin
}

export function readKotlinDraft(lesson, draft, style) {
  return draft?.kotlin?.[style] ?? kotlinExample(lesson, style)
}

export function stashKotlinDraft(previous, xml, kotlin, style) {
  return { xml, kotlin: { ...previous?.kotlin, [style]: kotlin } }
}

export function restoreXmlDrafts(saved, lessons) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {}
  const ids = new Set(lessons.map(lesson => lesson.id))
  const validCode = value => typeof value === 'string' && value.length <= 40000
  return Object.fromEntries(Object.entries(saved).flatMap(([id, draft]) => {
    if (!ids.has(id) || !draft || !validCode(draft.xml)) return []
    const kotlin = {}
    if (validCode(draft.kotlin)) {
      // Older versions stored one Kotlin file. Keep it in its original style;
      // the new View Binding example stays available without rewriting edits.
      const style = /\b\w+Binding\.inflate\s*\(/.test(draft.kotlin) ? 'binding' : 'traditional'
      kotlin[style] = draft.kotlin
    } else {
      for (const style of kotlinStyles) {
        if (validCode(draft.kotlin?.[style])) kotlin[style] = draft.kotlin[style]
      }
    }
    return [[id, { xml: draft.xml, kotlin }]]
  }))
}
