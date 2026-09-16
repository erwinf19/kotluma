import test from 'node:test'
import assert from 'node:assert/strict'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { parseCompose, evaluate, applyAction, modifierStyle, colorValue } from '../src/engine/compose.js'
import PreviewNode from '../src/components/PreviewNode.js'
import { lessons } from '../src/data/lessons.js'

async function render(source, overrides={}) {
  const tree=parseCompose(source);assert.equal(tree.error,null)
  return renderToString(createSSRApp({render:()=>h('main',{},tree.nodes.map(node=>h(PreviewNode,{node,state:{...tree.initialState,...overrides}})))}))
}
for(const lesson of lessons) test(`Every lesson renders without unsupported diagnostics: ${lesson.id}`,async()=>{
  const html=await render(lesson.code)
  assert.ok(html.includes('compose-'));assert.ok(!html.includes('compose-unsupported'),html)
})
test('Text and layout edits change rendered output instead of selecting a canned preview',async()=>{
  const before=await render('Column(modifier = Modifier.padding(12.dp)) { Text("Hello") }')
  const after=await render('Row(modifier = Modifier.padding(28.dp)) { Text("Selamat datang", fontSize = 36.sp) }')
  assert.ok(before.includes('padding:12px'));assert.ok(after.includes('padding:28px'));assert.ok(after.includes('font-size:36px'));assert.ok(after.includes('Selamat datang'));assert.ok(after.includes('compose-Row'))
})
test('Nested lists and interpolation use each item',async()=>{
  const html=await render('val names = listOf("Alex", "Sam")\nLazyColumn { items(names) { name -> Text("Hi, $name") } }')
  assert.ok(html.includes('Hi, Alex'));assert.ok(html.includes('Hi, Sam'))
})
test('Boolean actions update branches, assignment and increment preserve other state',async()=>{
  const source=lessons.find(l=>l.id==='profile-card').code
  const next=applyAction('{ following = !following }',{following:false})
  assert.equal(next.following,true)
  const html=await render(source,next);assert.ok(!html.includes('Follow Alex'));assert.ok(html.includes('Following'))
  assert.deepEqual(applyAction('{ count++; name = it }',{count:1,name:''},'Sam'),{count:2,name:'Sam'})
})
test('Dialog, bottom sheet, tabs, and navigation alternate states render correctly',async()=>{
  for(const [id,state,text] of [['dialog',{show:true},'Simpan perubahan?'],['bottom-sheet',{open:true},'Made for curious minds.'],['tabs',{tab:1},'Today: you learned'],['navigation',{page:'Saved'},'All your favorite']]){
    const html=await render(lessons.find(l=>l.id===id).code,state);assert.ok(!html.includes('compose-unsupported'),html);assert.ok(html.includes(text))
  }
})
test('Malformed, unimplemented and oversized code is rejected',()=>{
  for(const source of ['Text("oops)', 'Column { Text("x")', 'Text("a") }', 'WebView()', 'while (true) { Text("x") }',' '.repeat(30001)])assert.ok(parseCompose(source).error,source)
})
test('Markup and JavaScript are inert strings, not executable code',async()=>{
  const html=await render('Text("<img src=x onerror=alert(1)>")')
  assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'))
  assert.throws(()=>evaluate('globalThis.process.exit()'))
  assert.ok(parseCompose('val __proto__ = "pollute"\nText("x")').error)
  assert.throws(()=>applyAction('{ constructor = 3 }',{}))
})
test('Expressions handle nested commas, interpolation, Elvis, comparisons and methods',()=>{
  assert.equal(evaluate('"${name.length} chars"',{name:'Alex'}),'4 chars')
  assert.equal(evaluate('name ?: "Guest"',{name:null}),'Guest')
  assert.equal(evaluate('name.isNotEmpty() && count >= 2',{name:'Alex',count:3}),true)
  assert.deepEqual(evaluate('listOf("a,b", "c")'),['a,b','c'])
  assert.equal(evaluate('"a + b"'),'a + b')
})
test('Modifier dimensions and colors respond to values',()=>{
  assert.deepEqual(modifierStyle('Modifier.padding(horizontal = 24.dp, vertical = 8.dp).height(120.dp)'),{paddingLeft:'24px',paddingRight:'24px',paddingTop:'8px',paddingBottom:'8px',height:'120px'})
  assert.equal(colorValue('Color(0xFF7558ED)'),'#7558ED')
})
test('A failing compound action cannot partially commit state',()=>{
  const state={count:0};assert.throws(()=>applyAction('{ count++; unknown = 1 }',state));assert.equal(state.count,0)
})
test('Depth and item count are bounded',async()=>{
  assert.ok(parseCompose('Column {'.repeat(55)+'Text("x")'+'}'.repeat(55)).error)
  const html=await render('LazyColumn { items(1000000) { Text("item") } }')
  assert.equal((html.match(/compose-Text/g)||[]).length,60)
})
test('Nested list expansion is bounded before rendering',()=>{
  assert.ok(parseCompose('LazyColumn { items(60) { items(60) { items(60) { Text("x") } } } }').error)
})
test('Unsupported arguments are disclosed and composable parameters are rejected',()=>{
  assert.match(parseCompose('Text("hello", maxLines = 2)').warnings.join(' '),/maxLines/)
  assert.ok(parseCompose('@Composable\nfun Greeting(name: String) { Text(name) }').error)
})
test('Semicolons inside a string do not split event actions',()=>{
  assert.deepEqual(applyAction('{ name = "A; B" }',{name:''}),{name:'A; B'})
})

test('New recipes render validation, derived totals, and empty/navigation states',async()=>{
  const source=id=>lessons.find(l=>l.id===id).code
  assert.match(await render(source('login-page'),{submitted:true}),/minimal 6/)
  const loggedIn=await render(source('login-page'),{submitted:true,email:'learner@example.com',password:'demo123'})
  assert.match(loggedIn,/Welcome!/);assert.match(loggedIn,/type="password"/)
  const cart=applyAction('quantity++; total = quantity * 45000',{quantity:1,total:45000})
  assert.equal(cart.total,90000)
  assert.match(await render(source('checkout'),{...cart,confirm:true}),/Total: Rp 90000/)
  assert.match(await render(source('inbox'),{cleared:true}),/All caught up/)
  assert.match(await render(source('home-navigation'),{page:'Saved'}),/Saved collection/)
})

test('Compose collapsing header requires a matching nested-scroll connection',async()=>{
  const l=lessons.find(l=>l.id==='collapsing-header')
  const html=await render(l.code)
  assert.match(html,/collapsing-surface/);assert.match(html,/top:-88px/)
  const disconnected=await render(l.code.replace('Modifier.nestedScroll(scrollBehavior.nestedScrollConnection)','Modifier.fillMaxSize()'))
  assert.match(disconnected,/top:0px/)
  assert.match(await render(lessons.find(l=>l.id==='recycler-view').code,{grid:true}),/compose-LazyVerticalGrid/)
})
