export function learningTools({ lessons, getLessons, selectLesson, switchMode, read, nextTick }) {
  return [
    { name: 'set_kotluma_mode', title: 'Choose XML or Compose', description: 'Switch learning approach while preserving each mode local drafts. XML is the conventional Android Views mode.', inputSchema: { type: 'object', properties: { mode: { type: 'string', enum: ['xml','compose'] } }, required: ['mode'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: true }, async execute(input) { if(!input||!['xml','compose'].includes(input.mode)||Object.keys(input).some(key=>key!=='mode')) throw new Error('Choose xml or compose'); switchMode(input.mode); await nextTick(); return JSON.parse(JSON.stringify(read())) } },
    { name: 'list_kotluma_lessons', title: 'List Kotlin UI lessons', description: 'List the available learning examples without changing the current lesson.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute(input) { if (!input || typeof input !== 'object' || Object.keys(input).length) throw new Error('Expected an empty object'); return (getLessons?.()??lessons).map(({id,title,group})=>({id,title,group})) } },
    { name: 'open_kotluma_lesson', title: 'Open a Kotlin UI lesson', description: 'Save the current local draft and open the concepts, code example, and preview for a chosen lesson.', inputSchema: { type: 'object', properties: { lessonId: { type: 'string', enum: lessons.map(l=>l.id) } }, required: ['lessonId'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: true }, async execute(input) { if (!input || typeof input.lessonId !== 'string' || Object.keys(input).some(k=>k!=='lessonId') || !lessons.some(l=>l.id===input.lessonId)) throw new Error('Unknown lesson'); selectLesson(input.lessonId); await nextTick(); return JSON.parse(JSON.stringify(read())) } },
    { name: 'read_kotluma_preview', title: 'Read the active preview', description: 'Read the selected lesson, current simulation state, and parse diagnostics. No edits.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: true }, execute(input) { if (!input || typeof input !== 'object' || Object.keys(input).length) throw new Error('Expected an empty object'); return JSON.parse(JSON.stringify(read())) } }
  ]
}
export function registerLearningTools(context, tools) {
  if (!context?.registerTool) return () => {}
  const lifecycle = new AbortController()
  for (const tool of tools) {
    try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}) } catch { /* Optional browser capability; core UI remains usable. */ }
  }
  return () => lifecycle.abort()
}
