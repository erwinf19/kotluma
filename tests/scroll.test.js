import test from 'node:test'
import assert from 'node:assert/strict'
import { collapseProgress } from '../src/engine/scroll.js'
test('Collapsing range clamps overscroll and preserves the pinned toolbar',()=>{
  assert.deepEqual(collapseProgress(-20,240,56),{range:184,offset:0,progress:0})
  assert.deepEqual(collapseProgress(92,240,56),{range:184,offset:92,progress:0.5})
  assert.deepEqual(collapseProgress(900,240,56),{range:184,offset:184,progress:1})
  assert.equal(collapseProgress(300,240,240).progress,0)
})
