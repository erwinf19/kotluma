import test from 'node:test'
import assert from 'node:assert/strict'
import { handbook } from '../src/data/handbook.js'
import { conventionalLessons } from '../src/data/conventional.js'
import { lessons } from '../src/data/lessons.js'
test('Handbook imports safely and lesson links resolve',()=>{
  assert.equal(handbook.length,45)
  for(const entry of handbook){assert.ok(entry.example);assert.ok(entry.source.startsWith('https://'));if(entry.lessonId)assert.ok(lessons.some(l=>l.id===entry.lessonId),entry.id)}
  assert.ok(handbook.find(x=>x.id==='scope').example.includes('${it.name}'))
})

test('Recipe catalogs have matching unique IDs in both modes',()=>{
  assert.equal(lessons.length,27)
  assert.equal(new Set(lessons.map(l=>l.id)).size,27)
  assert.deepEqual(conventionalLessons.map(l=>l.id).sort(),lessons.map(l=>l.id).sort())
})
