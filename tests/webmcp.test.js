import test from 'node:test'
import assert from 'node:assert/strict'
import { learningTools, registerLearningTools } from '../src/services/webmcp.js'
test('Structured lesson navigation validates input and uses the same action',async()=>{
  let selected='first',mode='xml';const tools=learningTools({lessons:[{id:'first',title:'First'},{id:'second',title:'Second'}],selectLesson:id=>selected=id,switchMode:value=>mode=value,read:()=>({lessonId:selected}),nextTick:async()=>{}})
  assert.equal(tools.find(t=>t.name==='list_kotluma_lessons').execute({}).length,2)
  assert.deepEqual(await tools.find(t=>t.name==='open_kotluma_lesson').execute({lessonId:'second'}),{lessonId:'second'})
  await assert.rejects(tools.find(t=>t.name==='open_kotluma_lesson').execute({lessonId:'invalid'}));assert.equal(selected,'second')
  assert.deepEqual(tools.find(t=>t.name==='read_kotluma_preview').execute({}),{lessonId:'second'})
})
test('Optional registration cleans up and unsupported browsers are safe',()=>{
  let signal;registerLearningTools(undefined,[])()
  const dispose=registerLearningTools({registerTool:(_,options)=>signal=options.signal},[{name:'test'}])
  assert.equal(signal.aborted,false);dispose();assert.equal(signal.aborted,true)
})
test('Mode changes validate input and expose the active catalog',async()=>{
  let mode='xml'
  const tools=learningTools({lessons:[{id:'text'}],getLessons:()=>[{id:'text',title:mode==='xml'?'TextView':'Text'}],switchMode:value=>mode=value,read:()=>({mode}),nextTick:async()=>{}})
  const setMode=tools.find(tool=>tool.name==='set_kotluma_mode')
  const list=tools.find(tool=>tool.name==='list_kotluma_lessons')
  assert.equal(list.execute({})[0].title,'TextView')
  assert.deepEqual(await setMode.execute({mode:'compose'}),{mode:'compose'})
  assert.equal(list.execute({})[0].title,'Text')
  await assert.rejects(setMode.execute({mode:'native'}))
  await assert.rejects(setMode.execute({mode:'xml',extra:true}))
  assert.equal(mode,'compose')
})
