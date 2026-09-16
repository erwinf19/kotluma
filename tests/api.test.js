import test from 'node:test'
import assert from 'node:assert/strict'
import { createApiClient, createMockTransport } from '../src/services/api.js'
test('Transport is explicit and mock success/empty are deterministic',async()=>{
  assert.throws(()=>createApiClient())
  const client=createApiClient({transport:createMockTransport({delayMs:0})})
  assert.equal((await client.request({url:'/users'})).data.length,2)
  const empty=createApiClient({transport:createMockTransport({scenario:'empty',delayMs:0})})
  assert.deepEqual((await empty.request({url:'/users'})).data,[])
})
test('HTTP errors and 204 are normalized',async()=>{
  const client=createApiClient({transport:createMockTransport({scenario:'error',delayMs:0})})
  await assert.rejects(client.request({url:'/users'}),e=>e.kind==='http'&&e.status===503)
  const noContent=createApiClient({transport:async()=>({status:204})})
  assert.equal((await noContent.request({url:'/users'})).data,null)
})
test('Timeout works even if transport ignores abort',async()=>{
  const client=createApiClient({transport:()=>new Promise(()=>{}),timeoutMs:5})
  await assert.rejects(client.request({url:'/slow'}),e=>e.kind==='timeout')
})
test('Cancellation and pre-aborted signals are honored',async()=>{
  const client=createApiClient({transport:createMockTransport({delayMs:1000})})
  const controller=new AbortController();const pending=client.request({url:'/users',signal:controller.signal});controller.abort()
  await assert.rejects(pending,e=>e.kind==='cancelled')
  await assert.rejects(client.request({url:'/users',signal:controller.signal}),e=>e.kind==='cancelled')
})
