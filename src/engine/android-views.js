import { parseTextListAdapter } from './recycler-adapter.js'
import { DOMParser } from '@xmldom/xmldom'
import { evaluate, splitTop } from './compose.js'

export const supportedViews = ['androidx.recyclerview.widget.RecyclerView','androidx.core.widget.NestedScrollView','com.google.android.material.appbar.AppBarLayout','com.google.android.material.appbar.CollapsingToolbarLayout','androidx.appcompat.widget.Toolbar','com.google.android.material.bottomnavigation.BottomNavigationView','LinearLayout','FrameLayout','ScrollView','HorizontalScrollView','GridLayout','TextView','Button','ImageButton','ImageView','EditText','Switch','CheckBox','RadioGroup','RadioButton','SeekBar','ProgressBar','View','Space','ListView','androidx.cardview.widget.CardView','com.google.android.material.card.MaterialCardView','com.google.android.material.button.MaterialButton','com.google.android.material.switchmaterial.SwitchMaterial','com.google.android.material.chip.Chip','com.google.android.material.chip.ChipGroup','androidx.coordinatorlayout.widget.CoordinatorLayout']
const knownViews=new Set(supportedViews)
const knownAttrs=new Set(['id','layout_width','layout_height','orientation','gravity','layout_gravity','layout_weight','weightSum','text','textSize','textStyle','textColor','textAllCaps','textAlignment','maxLines','ellipsize','hint','inputType','singleLine','enabled','checked','visibility','alpha','background','backgroundTint','buttonTint','tint','src','contentDescription','padding','paddingHorizontal','paddingVertical','paddingTop','paddingBottom','paddingStart','paddingEnd','paddingLeft','paddingRight','layout_margin','layout_marginHorizontal','layout_marginVertical','layout_marginTop','layout_marginBottom','layout_marginStart','layout_marginEnd','layout_marginLeft','layout_marginRight','minWidth','minHeight','elevation','cardCornerRadius','cardElevation','cardBackgroundColor','contentPadding','columnCount','rowCount','layout_columnWeight','layout_rowWeight','fillViewport','progress','max','indeterminate','style','checkedButton','layout_behavior','behavior_peekHeight','checkable','chipBackgroundColor','chipCornerRadius','strokeColor','strokeWidth','cornerRadius','labelVisibilityMode','itemIconTint','itemTextColor','nestedScrollingEnabled','clipToPadding','layout_scrollFlags','layout_collapseMode','layout_collapseParallaxMultiplier','title','contentScrim'])
export function parseAndroidXml(source) {
  try {
    if(source.length>40000)throw Error('Layout maksimal 40.000 karakter.')
    if(/<!DOCTYPE|<!ENTITY/i.test(source))throw Error('DOCTYPE dan deklarasi entity tidak didukung.')
    const issues=[]
    const document=new DOMParser({onError:(level,message)=>{issues.push(message)}}).parseFromString(source,'application/xml')
    if(issues.length)throw Error('XML belum valid: '+issues[0].replace(/\n.*$/s,''))
    if(!document.documentElement)throw Error('Tambahkan satu root layout XML.')
    const warnings=[],views=Object.create(null);let count=0
    function walk(element,depth=0){
      if(depth>40||++count>600)throw Error('Layout terlalu kompleks: maksimal 600 view dan 40 tingkat.')
      const type=element.tagName
      if(!knownViews.has(type))throw Error(`View ${type} belum didukung. Lihat daftar dukungan XML.`)
      const attrs=Object.create(null)
      for(let i=0;i<element.attributes.length;i++){
        const attribute=element.attributes[i]
        if(attribute.name.startsWith('xmlns'))continue
        if(attribute.prefix==='tools'){warnings.push(`Atribut preview ${attribute.name} belum disimulasikan.`);continue}
        const name=attribute.localName??attribute.name;attrs[name]=attribute.value
        if(!knownAttrs.has(name))warnings.push(`Atribut ${attribute.name} pada ${type} belum disimulasikan.`)
      }
      if(!attrs.layout_width||!attrs.layout_height)throw Error(`${type} membutuhkan android:layout_width dan android:layout_height.`)
      const id=attrs.id?.replace(/^@\+?id\//,'')??`__view_${count}`
      if(Object.hasOwn(views,id))throw Error(`ID ${id} duplikat. Gunakan ID berbeda untuk setiap view.`)
      if(['__proto__','constructor','prototype'].includes(id))throw Error('ID view ini tidak didukung.')
      views[id]={text:attrs.text??'',checked:attrs.checked==='true',enabled:attrs.enabled!=='false',visibility:attrs.visibility??'visible',alpha:Number(attrs.alpha??1),progress:Number(attrs.progress??0)}
      if(attrs.layout_behavior?.includes('bottom_sheet'))views[id].visibility='gone'
      const children=[]
      for(let child=element.firstChild;child;child=child.nextSibling){if(child.nodeType===1)children.push(walk(child,depth+1));else if(child.nodeType===3&&child.data.trim())throw Error('Gunakan android:text untuk isi TextView, bukan teks di antara tag.')}
      if(['ScrollView','HorizontalScrollView','androidx.core.widget.NestedScrollView'].includes(type)&&children.length>1)throw Error(`${type} hanya boleh memiliki satu anak langsung. Bungkus anak dalam LinearLayout.`)
      if(attrs.layout_scrollFlags&&attrs.layout_scrollFlags!=='scroll|exitUntilCollapsed')throw Error('Scroll flags yang didukung: scroll|exitUntilCollapsed.');
      if(attrs.layout_collapseMode&&!['pin','parallax','none'].includes(attrs.layout_collapseMode))throw Error('collapseMode yang didukung: pin, parallax, none.');
      if(attrs.checkedButton){const target=attrs.checkedButton.replace(/^@\+?id\//,'');if(views[target])views[target].checked=true}
      return {type,id,attrs,children,line:element.lineNumber??1}
    }
    const nodes=[walk(document.documentElement)]
    return {nodes,views,warnings:[...new Set(warnings)],error:null}
  }catch(error){return {nodes:[],views:{},warnings:[],error:error.message}}
}

// Balanced Kotlin blocks, aware of quoted strings and comments. No eval/Function.
function matching(source,start,open='{',close='}') {
  let depth=1,quoted=false
  for(let i=start+1;i<source.length;i++){
    if(quoted){if(source[i]==='\\')i++;else if(source[i]==='"')quoted=false;continue}
    if(source[i]==='"'){quoted=true;continue}
    if(source.slice(i,i+2)==='//'){while(i<source.length&&source[i]!=='\n')i++;continue}
    if(source[i]===open)depth++
    if(source[i]===close){depth--;if(depth===0)return i} 
  }
  throw Error(`Blok Kotlin ${open}${close} belum ditutup.`)
}
// Keep delimiters isolated; the scanner above only decreases depth on closing tokens.
function stripComments(source){return source.replace(/"(?:\\.|[^"\\])*"|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,match=>match.startsWith('"')?match:' '.repeat(match.length))}
function statements(source){return splitTop(source,';').flatMap(x=>splitTop(x,'\n')).map(x=>x.trim()).filter(Boolean)}
const safeName=name=>/^[A-Za-z_]\w*$/.test(name)&&!['__proto__','constructor','prototype'].includes(name)
const camel=id=>id.replace(/_([a-z0-9])/g,(_,x)=>x.toUpperCase())
function context(state,aliases,locals={}){
  const ctx={...state.variables,...locals}
  for(const [alias,id] of Object.entries(aliases)){
    const view=state.views[id];if(!view)continue
    for(const [prop,value] of Object.entries(view)){ctx[`${alias}.${prop}`]=value;ctx[`${alias}.${prop}.toString()`]=String(value)}
    ctx[`${alias}.isChecked`]=view.checked;ctx[`${alias}.isEnabled`]=view.enabled
    ctx[`R.id.${id}`]=id
  }
  Object.assign(ctx,{'View.VISIBLE':'visible','View.GONE':'gone','View.INVISIBLE':'invisible','BottomSheetBehavior.STATE_EXPANDED':'expanded','BottomSheetBehavior.STATE_COLLAPSED':'collapsed','BottomSheetBehavior.STATE_HIDDEN':'hidden'})
  return ctx
}
export function evaluateViewExpression(raw,state,aliases,locals={}){
  const source=raw.trim();const ctx=context(state,aliases,locals)
  if(source.startsWith('if')){
    const start=source.indexOf('(');if(start<0)throw Error('Ekspresi if membutuhkan kondisi.')
    const end=matching(source,start,'(',')');const remainder=source.slice(end+1).trim();const branches=splitTop(remainder,' else ')
    if(branches.length!==2)throw Error('Ekspresi if membutuhkan else.')
    return evaluateViewExpression(evaluateViewExpression(source.slice(start+1,end),state,aliases,locals)?branches[0]:branches[1],state,aliases,locals)
  }
  const normalized=source.replace(/(\w+(?:\.\w+)*)\.text\.toString\(\)/g,'$1.text.toString()')
  return evaluate(normalized,ctx)
}
function compileActions(source) {
  const cleaned=stripComments(source);let i=0;const result=[]
  while(i<cleaned.length){
    while(/[\s;]/.test(cleaned[i]??'')&&i<cleaned.length)i++
    if(i>=cleaned.length)break
    if(/^if\s*\(/.test(cleaned.slice(i))){
      const start=cleaned.indexOf('(',i),end=matching(cleaned,start,'(',')'),condition=cleaned.slice(start+1,end);let brace=end+1;while(/\s/.test(cleaned[brace]??''))brace++
      if(cleaned[brace]!=='{')throw Error('Gunakan blok { } untuk if pada listener.')
      const close=matching(cleaned,brace);const children=compileActions(cleaned.slice(brace+1,close));i=close+1;let alternate=[]
      while(/\s/.test(cleaned[i]??''))i++
      if(cleaned.slice(i,i+4)==='else'){i+=4;while(/\s/.test(cleaned[i]??''))i++;if(cleaned[i]!=='{')throw Error('else membutuhkan blok { }.');const finish=matching(cleaned,i);alternate=compileActions(cleaned.slice(i+1,finish));i=finish+1}
      result.push({type:'if',condition,children,alternate});continue
    }
    if(cleaned.startsWith('AlertDialog.Builder',i)){
      const finish=cleaned.indexOf('.show()',i);if(finish<0)throw Error('AlertDialog membutuhkan .show().');const chain=cleaned.slice(i,finish+7)
      const textCall=name=>{const start=chain.indexOf('.'+name+'(');if(start<0)return '""';const at=start+name.length+1;return chain.slice(at+1,matching(chain,at,'(',')'))}
      const title=textCall('setTitle'),message=textCall('setMessage'),positive=textCall('setPositiveButton'),negative=textCall('setNegativeButton')
      const actions={};for(const [key,name] of [['positive','setPositiveButton'],['negative','setNegativeButton']]){const at=chain.indexOf('.'+name+'(');if(at<0)continue;const pos=at+name.length+1,end=matching(chain,pos,'(',')');let brace=end+1;while(/\s/.test(chain[brace]??''))brace++;if(chain[brace]==='{'){const close=matching(chain,brace);actions[key]=compileActions(chain.slice(brace+1,close).replace(/^\s*[^\n{}]*?->/,''))}}
      result.push({type:'dialog',title,message,positive:splitTop(positive)[0],negative:splitTop(negative)[0],actions});i=finish+7;continue
    }
    let end=i,depth=0,quoted=false
    for(;end<cleaned.length;end++){const c=cleaned[end];if(quoted){if(c==='\\')end++;else if(c==='"')quoted=false;continue}if(c==='"'){quoted=true;continue}if('({['.includes(c))depth++;if(')}]'.includes(c))depth--;if((c==='\n'||c===';')&&depth===0)break}
    const line=cleaned.slice(i,end).trim();i=end+1;if(!line)continue
    let recycler=line.match(/^(\w+(?:\.\w+)?)\.layoutManager\s*=\s*(LinearLayoutManager|GridLayoutManager)\(this(?:,\s*(\d+))?\)$/)
    if(recycler){const columns=recycler[2]==='GridLayoutManager'?Number(recycler[3]):1;if(!Number.isInteger(columns)||columns<1||columns>6)throw Error('GridLayoutManager membutuhkan 1–6 kolom.');result.push({type:'recyclerLayout',target:recycler[1],columns});continue}
    recycler=line.match(/^(\w+(?:\.\w+)?)\.adapter\s*=\s*TextListAdapter\(([\s\S]+)\)$/)
    if(recycler){result.push({type:'recyclerAdapter',target:recycler[1],items:recycler[2]});continue}
    let menu=line.match(/^(\w+(?:\.\w+)?)\.menu\.add\(([\s\S]+)\)\.setIcon\(android\.R\.drawable\.(\w+)\)$/)
    if(menu){const args=splitTop(menu[2]);if(args.length!==4)throw Error('menu.add membutuhkan groupId, itemId, order, dan title.');result.push({type:'menuAdd',target:menu[1],id:args[1],order:args[2],title:args[3],icon:menu[3]});continue}
    let m=line.match(/^(\w+(?:\.\w+)?)\.(text|visibility|isEnabled|isChecked|progress|alpha|state|selectedItemId)\s*=\s*([\s\S]+)$/)
    if(m){result.push({type:'property',target:m[1],property:m[2],value:m[3]});continue}
    m=line.match(/^(\w+(?:\.\w+)?)\.animate\(\)\.alpha\(([\s\S]+)\)\.setDuration\(\d+\)\.start\(\)$/)
    if(m){result.push({type:'property',target:m[1],property:'alpha',value:m[2]});continue}
    m=line.match(/^(\w+(?:\.\w+)?)\.setText\(([\s\S]*)\)$/)
    if(m){result.push({type:'property',target:m[1],property:'text',value:m[2]});continue}
    m=line.match(/^(\w+(?:\.\w+)?)\.adapter\s*=\s*ArrayAdapter(?:<[^>]+>)?\(([\s\S]+)\)$/)
    if(m){const args=splitTop(m[2]);result.push({type:'property',target:m[1],property:'items',value:args.at(-1)});continue}
    if(/^\w+\s*(?:\+\+|--|(?:=|\+=|-=)\s*[\s\S]+)$/.test(line)){result.push({type:'variable',source:line});continue}
    throw Error(`Kotlin belum disimulasikan: ${line.slice(0,95)}`)
  }
  return result
}
function runActions(actions,state,aliases,locals={}){
  for(const action of actions){
    if(action.type==='if'){runActions(evaluateViewExpression(action.condition,state,aliases,locals)?action.children:action.alternate,state,aliases,locals);continue}
    if(action.type==='dialog'){state.dialog={title:evaluateViewExpression(action.title,state,aliases,locals),message:evaluateViewExpression(action.message,state,aliases,locals),positive:evaluateViewExpression(action.positive,state,aliases,locals)||'OK',negative:evaluateViewExpression(action.negative,state,aliases,locals),actions:action.actions};continue}
    if(action.type==='recyclerLayout'||action.type==='recyclerAdapter'){
      const view=state.views[aliases[action.target]];if(!view)throw Error('RecyclerView tidak ditemukan.')
      if(action.type==='recyclerLayout'){view.columns=action.columns;continue}
      if(!state.adapters?.TextListAdapter)throw Error('Tambahkan class TextListAdapter lengkap dari contoh di bawah Activity.')
      const items=evaluateViewExpression(action.items,state,aliases,locals)
      if(!Array.isArray(items)||items.length>60||items.some(item=>typeof item!=='string'))throw Error('TextListAdapter membutuhkan listOf String, maksimal 60 item.')
      view.items=items;view.adapterStyle=state.adapters.TextListAdapter;continue
    }
    if(action.type==='menuAdd'){
      const view=state.views[aliases[action.target]];if(!view)throw Error('BottomNavigationView tidak ditemukan.')
      const item={id:evaluateViewExpression(action.id,state,aliases,locals),order:evaluateViewExpression(action.order,state,aliases,locals),title:evaluateViewExpression(action.title,state,aliases,locals),icon:action.icon}
      if(!Number.isInteger(item.id)||item.id<=0)throw Error('ID menu harus bilangan bulat positif.')
      if(!Number.isFinite(item.order))throw Error('Urutan menu harus berupa angka.')
      view.menu??=[]
      if(view.menu.length>=5||view.menu.some(existing=>existing.id===item.id))throw Error('Bottom navigation maksimal 5 item dengan ID unik.')
      view.menu.push(item);view.menu.sort((a,b)=>a.order-b.order);view.selectedItemId??=item.id;continue
    }
    if(action.type==='property'){
      const id=aliases[action.target];if(!id||!state.views[id])throw Error(`View ${action.target} tidak ditemukan. Periksa R.id dan XML.`)
      const value=evaluateViewExpression(action.value,state,aliases,locals)
      if(action.property==='selectedItemId'&&!state.views[id].menu?.some(item=>item.id===value))throw Error('selectedItemId tidak ditemukan dalam menu.')
      if(action.property==='state')state.views[id].visibility=value==='expanded'?'visible':'gone'
      else state.views[id][{isEnabled:'enabled',isChecked:'checked'}[action.property]??action.property]=value
      continue
    }
    const match=action.source.match(/^(\w+)\s*(\+\+|--|\+=|-=|=)\s*([\s\S]*)$/)
    if(!match||!Object.hasOwn(state.variables,match[1]))throw Error(`Variabel tidak ditemukan: ${action.source}`)
    const [,name,op,raw]=match;const value=['++','--'].includes(op)?1:evaluateViewExpression(raw,state,aliases,locals)
    state.variables[name]=op==='='?value:['++','+='].includes(op)?state.variables[name]+value:state.variables[name]-value
  }
}
export function parseViewActivity(source,xmlViews){
  const state={variables:{},views:JSON.parse(JSON.stringify(xmlViews)),dialog:null},aliases=Object.create(null),listeners=Object.create(null),warnings=[]
  try{
    if(source.length>40000)throw Error('Kotlin maksimal 40.000 karakter.')
    const cleaned=stripComments(source)
    const adapter=cleaned.match(/class\s+TextListAdapter\b[^{}]*\{/)
    if(adapter){const at=adapter.index+adapter[0].length-1;state.adapters={TextListAdapter:parseTextListAdapter(cleaned.slice(adapter.index,matching(cleaned,at)+1))}}
    const fn=cleaned.match(/override\s+fun\s+onCreate\s*\([^)]*\)\s*\{/)
    if(!fn)throw Error('Gunakan Activity dengan override fun onCreate(savedInstanceState: Bundle?).')
    const start=fn.index+fn[0].length-1,end=matching(cleaned,start);let body=cleaned.slice(start+1,end)
    for(const id of Object.keys(xmlViews)){aliases[`binding.${camel(id)}`]=id}
    // Explicit view lookup declarations keep XML IDs and Kotlin references connected.
    body=body.replace(/val\s+(\w+)\s*=\s*findViewById<[^>]+>\(R\.id\.(\w+)\)/g,(_,name,id)=>{if(!safeName(name)||!xmlViews[id])throw Error(`R.id.${id} tidak ditemukan pada layout.`);aliases[name]=id;return ''})
    body=body.replace(/val\s+(\w+)\s*=\s*BottomSheetBehavior\.from\(findViewById<[^>]+>\(R\.id\.(\w+)\)\)/g,(_,name,id)=>{if(!xmlViews[id])throw Error(`Bottom sheet ${id} tidak ditemukan.`);aliases[name]=id;return ''})
    body=body.replace(/val\s+binding\s*=\s*\w+Binding\.inflate\(layoutInflater\)/g,'')
    // Local aliases let the same teaching listeners work with either lookup style.
    body=body.replace(/val\s+(\w+)\s*=\s*(binding\.\w+)\b(?![.\w(])/g,(_,name,reference)=>{if(!safeName(name)||!aliases[reference])throw Error(`Referensi ${reference} tidak ditemukan pada layout.`);aliases[name]=aliases[reference];return ''})
    body=body.replace(/val\s+(\w+)\s*=\s*BottomSheetBehavior\.from\((binding\.\w+)\)/g,(_,name,reference)=>{if(!safeName(name)||!aliases[reference])throw Error(`Bottom sheet ${reference} tidak ditemukan pada layout.`);aliases[name]=aliases[reference];return ''})

    body=body.replace(/super\.onCreate\(savedInstanceState\)/g,'').replace(/setContentView\((?:R\.layout\.\w+|binding\.root)\)/g,'')
    const pattern=/(\w+(?:\.\w+)?)\.(setOnClickListener|setOnCheckedChangeListener|doAfterTextChanged|setOnItemClickListener|setOnItemSelectedListener)\s*\{/g
    let match
    while((match=pattern.exec(body))){
      const at=match.index+match[0].length-1,close=matching(body,at),target=match[1],id=aliases[target]
      if(!id)throw Error(`Referensi ${target} belum dihubungkan dengan findViewById atau ViewBinding.`)
      let callback=body.slice(at+1,close);const params=callback.match(/^\s*([^\n{}]*?)\s*->/);const names=params?params[1].split(',').map(x=>x.trim()):[]
      if(params)callback=callback.slice(params[0].length)
      const event={setOnClickListener:'click',setOnCheckedChangeListener:'change',doAfterTextChanged:'text',setOnItemClickListener:'item',setOnItemSelectedListener:'navigation'}[match[2]]
      let accepted=true
      if(event==='navigation'){const result=callback.match(/\b(true|false)\s*$/);if(!result)throw Error('Listener menu harus diakhiri true atau false.');accepted=result[1]==='true';callback=callback.slice(0,result.index)}
      listeners[`${id}:${event}`]={actions:compileActions(callback),params:names,accepted}
      body=body.slice(0,match.index)+' '.repeat(close+1-match.index)+body.slice(close+1);pattern.lastIndex=0
    }
    const scroll=/(\w+(?:\.\w+)?)\.setOnScrollChangeListener\(NestedScrollView\.OnScrollChangeListener\s*\{/g
    while((match=scroll.exec(body))){
      const at=match.index+match[0].length-1,close=matching(body,at),id=aliases[match[1]]
      if(!id)throw Error('NestedScrollView belum ditemukan.')
      const callback=body.slice(at+1,close),params=callback.match(/^\s*([^{}]*?)\s*->/)
      if(!params)throw Error('Scroll listener membutuhkan lima parameter.')
      const names=params[1].split(',').map(x=>x.trim());if(names.length!==5)throw Error('Scroll listener membutuhkan lima parameter.')
      listeners[`${id}:scroll`]={actions:compileActions(callback.slice(params[0].length)),params:names}
      let finish=close+1;while(/\s/.test(body[finish]??''))finish++;if(body[finish]!==')')throw Error('Tutup scroll listener dengan }).')
      body=body.slice(0,match.index)+' '.repeat(finish+1-match.index)+body.slice(finish+1);scroll.lastIndex=0
    }
    const seek=/(\w+)\.setOnSeekBarChangeListener\(object\s*:\s*SeekBar\.OnSeekBarChangeListener\s*\{/g
    while((match=seek.exec(body))){const at=match.index+match[0].length-1,close=matching(body,at),object=body.slice(at+1,close);const change=object.match(/override\s+fun\s+onProgressChanged\([^)]*\)\s*\{/);if(!change)throw Error('SeekBar listener membutuhkan onProgressChanged.');const begin=change.index+change[0].length-1,finish=matching(object,begin),id=aliases[match[1]];if(!id)throw Error('SeekBar belum ditemukan.');listeners[`${id}:progress`]={actions:compileActions(object.slice(begin+1,finish)),params:['_','progress','fromUser']};body=body.slice(0,match.index)+' '.repeat(close+2-match.index)+body.slice(close+2);seek.lastIndex=0}
    const initial=[]
    for(const line of statements(body)){
      const declaration=line.match(/^(val|var)\s+(\w+)(?:\s*:\s*\w+\??)?\s*=\s*([\s\S]+)$/)
      if(declaration){if(!safeName(declaration[2]))throw Error('Nama variabel tidak didukung.');state.variables[declaration[2]]=evaluateViewExpression(declaration[3],state,aliases);continue}
      if(line.trim())initial.push(...compileActions(line))
    }
    runActions(initial,state,aliases)
    return {state,aliases,listeners,warnings,error:null}
  }catch(error){return {state,aliases,listeners:{},warnings,error:error.message}}
}
export function parseConventional(xml,kotlin){const layout=parseAndroidXml(xml);if(layout.error)return {...layout,initialState:{variables:{},views:{},dialog:null},activityError:null,listeners:{},aliases:{}};const activity=parseViewActivity(kotlin,layout.views);return {nodes:layout.nodes,error:null,activityError:activity.error,warnings:[...layout.warnings,...activity.warnings],initialState:activity.state,aliases:activity.aliases,listeners:activity.listeners}}
export function applyViewEvent(parsed,state,event){
  const next=JSON.parse(JSON.stringify(state))
  if(event.type==='dialog'){const actions=next.dialog?.actions?.[event.value]??[];next.dialog=null;runActions(actions,next,parsed.aliases);return next}
  const view=next.views[event.viewId];if(!view)throw Error('View tidak ditemukan.')
  if(event.type==='navigation'){
    const item=view.menu?.find(item=>item.id===event.value);if(!item)throw Error('Item menu tidak ditemukan.')
    const handler=parsed.listeners[`${event.viewId}:navigation`]
    if(handler){const name=handler.params[0]??'it';runActions(handler.actions,next,parsed.aliases,{[`${name}.itemId`]:item.id,[`${name}.title`]:item.title});if(handler.accepted)view.selectedItemId=item.id}else view.selectedItemId=item.id
    return next
  }
  if(event.type==='text')view.text=event.value
  if(event.type==='change'){view.checked=event.value;if(event.siblings)for(const id of event.siblings)if(id!==event.viewId&&next.views[id])next.views[id].checked=false}
  if(event.type==='scroll')view.scrollY=event.value
  if(event.type==='progress')view.progress=event.value
  const handler=parsed.listeners[`${event.listenerId??event.viewId}:${event.type}`]
  if(handler){const args=event.type==='scroll'?[null,0,event.value,0,state.views[event.viewId].scrollY??0]:event.type==='click'?[null]:event.type==='text'?[event.value]:event.type==='item'?[null,null,event.value,0]:[null,event.listenerValue??event.value,true];const locals={it:event.value};handler.params.forEach((name,index)=>{if(name!=='_')locals[name]=args[index]});runActions(handler.actions,next,parsed.aliases,locals)}
  return next
}
