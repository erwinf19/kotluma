import test from 'node:test'
import assert from 'node:assert/strict'
import { conventionalLessons } from '../src/data/conventional.js'
import { readKotlinDraft, restoreXmlDrafts, stashKotlinDraft } from '../src/services/kotlin-drafts.js'

const lesson = conventionalLessons.find(item => item.id === 'buttons')

test('Legacy edits survive migration while View Binding starts with the new example', () => {
  const edited = lesson.traditionalKotlin.replace('count++', 'count += 5')
  const restored = restoreXmlDrafts({ buttons: { xml: lesson.xml, kotlin: edited } }, conventionalLessons)
  assert.equal(readKotlinDraft(lesson, restored.buttons, 'traditional'), edited)
  assert.equal(readKotlinDraft(lesson, restored.buttons, 'binding'), lesson.kotlin)
  assert.equal(restored.buttons.xml, lesson.xml)
})

test('Legacy View Binding drafts keep their edits in the binding variant', () => {
  const edited = lesson.kotlin.replace('count++', 'count += 7')
  const restored = restoreXmlDrafts({ buttons: { xml: lesson.xml, kotlin: edited } }, conventionalLessons)
  assert.equal(readKotlinDraft(lesson, restored.buttons, 'binding'), edited)
  assert.equal(readKotlinDraft(lesson, restored.buttons, 'traditional'), lesson.traditionalKotlin)
})

test('Switching styles, saving, and reloading preserve independent Kotlin edits and shared XML', () => {
  const binding = lesson.kotlin.replace('count++', 'count += 2')
  const traditional = lesson.traditionalKotlin.replace('count++', 'count += 3')
  let draft = stashKotlinDraft(undefined, lesson.xml, binding, 'binding')
  draft = stashKotlinDraft(draft, lesson.xml + '\n', traditional, 'traditional')
  const restored = restoreXmlDrafts(JSON.parse(JSON.stringify({ buttons: draft })), conventionalLessons)
  assert.equal(readKotlinDraft(lesson, restored.buttons, 'binding'), binding)
  assert.equal(readKotlinDraft(lesson, restored.buttons, 'traditional'), traditional)
  assert.equal(restored.buttons.xml, lesson.xml + '\n')
})

test('Resetting one Kotlin style keeps the other style draft', () => {
  const edited = lesson.traditionalKotlin.replace('count++', 'count += 3')
  let draft = stashKotlinDraft(undefined, lesson.xml, edited, 'traditional')
  draft = stashKotlinDraft(draft, lesson.xml, lesson.kotlin, 'binding')
  assert.equal(readKotlinDraft(lesson, draft, 'traditional'), edited)
  assert.equal(readKotlinDraft(lesson, draft, 'binding'), lesson.kotlin)
})

test('Corrupted or oversized saved values cannot replace valid examples', () => {
  const restored = restoreXmlDrafts({
    unknown: { xml: lesson.xml, kotlin: 'arbitrary' },
    buttons: { xml: lesson.xml, kotlin: { binding: 'x'.repeat(40001), traditional: 42 } },
    'hello-kotlin': { xml: null, kotlin: 'bad' },
  }, conventionalLessons)
  assert.deepEqual(Object.keys(restored), ['buttons'])
  assert.equal(readKotlinDraft(lesson, restored.buttons, 'binding'), lesson.kotlin)
  assert.equal(readKotlinDraft(lesson, restored.buttons, 'traditional'), lesson.traditionalKotlin)
})
