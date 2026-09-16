// A deliberately bounded Compose interpreter. Never executes JavaScript or Kotlin.
export const supportedComponents = ['Column','Row','Box','LazyColumn','LazyRow','LazyVerticalGrid','Text','Button','OutlinedButton','TextButton','IconButton','FloatingActionButton','Card','ElevatedCard','Surface','Spacer','Icon','OutlinedTextField','TextField','Switch','Checkbox','RadioButton','Slider','HorizontalDivider','LinearProgressIndicator','CircularProgressIndicator','FilterChip','AssistChip','SuggestionChip','NavigationBar','NavigationBarItem','TabRow','Tab','TopAppBar','LargeTopAppBar','Scaffold','Badge','BadgedBox','AlertDialog','ModalBottomSheet','AnimatedVisibility']
const known = new Set(supportedComponents)
const supportedArgs = new Set(['modifier','text','fontSize','fontWeight','textAlign','style','color','tint','imageVector','contentDescription','verticalArrangement','horizontalArrangement','horizontalAlignment','verticalAlignment','contentAlignment','columns','shape','colors','onClick','selected','enabled','icon','leadingIcon','label','value','onValueChange','placeholder','visualTransformation','checked','onCheckedChange','valueRange','steps','progress','title','navigationIcon','actions','topBar','bottomBar','floatingActionButton','selectedTabIndex','onDismissRequest','confirmButton','dismissButton','visible','scrollBehavior'])
const modifiers = new Set(['padding','fillMaxWidth','fillMaxHeight','fillMaxSize','height','width','size','background','clip','weight','border','alpha','clickable','verticalScroll','horizontalScroll','defaultMinSize','nestedScroll'])
const positional = { Text:['text'], Icon:['imageVector','contentDescription'], Spacer:['modifier'], Switch:['checked','onCheckedChange'], Checkbox:['checked','onCheckedChange'], RadioButton:['selected','onClick'], Slider:['value','onValueChange'], AnimatedVisibility:['visible'], LinearProgressIndicator:['progress'] }

function tokenize(source) {
  const tokens = []; let i = 0; let line = 1
  while (i < source.length) {
    const start = i, ch = source[i]
    if (ch === '\n') { tokens.push({v:'\n',start,end:++i,line:line++}); continue }
    if (/\s/.test(ch)) { i++; continue }
    if (source.startsWith('//',i)) { while (i < source.length && source[i] !== '\n') i++; continue }
    if (source.startsWith('/*',i)) { const end = source.indexOf('*/',i+2); if(end<0) throw Error(`Baris ${line}: komentar belum ditutup.`); line += (source.slice(i,end+2).match(/\n/g)||[]).length; i=end+2; continue }
    if (ch === '"') { i++; while (i<source.length && source[i]!=='"') { if(source[i]==='\\') i++; if(source[i]==='\n') line++; i++ } if(i>=source.length) throw Error(`Baris ${line}: tutup teks dengan tanda petik.`); i++ }
    else if (/[A-Za-z_$]/.test(ch)) { i++; while(i<source.length && /[\w$]/.test(source[i])) i++ }
    else if (/\d/.test(ch)) { i++; while(i<source.length && /[\w.]/.test(source[i])) i++ }
    else if (['==','!=','>=','<=','++','--','+=','-=','&&','||','->','?:','?.'].includes(source.slice(i,i+2))) i+=2
    else i++
    tokens.push({v:source.slice(start,i),start,end:i,line})
  }
  const stack=[]; const pairs={')':'(',']':'[','}':'{'}
  for(const t of tokens) { if(['(','[','{'].includes(t.v)) stack.push(t); if(pairs[t.v] && stack.pop()?.v!==pairs[t.v]) throw Error(`Baris ${t.line}: pasangan kurung tidak cocok.`) }
  if(stack.length) throw Error(`Baris ${stack.at(-1).line}: kurung belum ditutup.`)
  return tokens
}

export function parseCompose(source) {
  try {
    if(source.length>30000) throw Error('Maksimal 30.000 karakter untuk satu preview.')
    const tokens=tokenize(source); let p=0, count=0; const warnings=[]; const initialState=Object.create(null)
    const v=()=>tokens[p]?.v
    const skip=()=>{while(v()==='\n'||v()===';') p++}
    const raw=(start,end)=>tokens[start] ? source.slice(tokens[start].start,tokens[end-1]?.end??tokens[start].end).trim():''
    const group=()=>{ const start=p, open=v(),close={'(':')','{':'}','[':']'}[open]; p++; let depth=1; while(p<tokens.length&&depth){if(v()===open)depth++;if(v()===close)depth--;p++} return raw(start+1,p-1) }
    const expression=(stopNewline=false)=>{const start=p;while(p<tokens.length){if(v()===','||v()==='}'||v()===')'||(stopNewline&&(v()==='\n'||v()===';')))break;if(['(','{','['].includes(v()))group();else p++}return raw(start,p)}
    function body(end='}',depth=0) {
      if(depth>50) throw Error('Layout terlalu dalam (maksimal 50 tingkat).')
      const nodes=[]
      while(p<tokens.length&&v()!==end){
        skip(); if(v()===end||p>=tokens.length)break
        const t=tokens[p]; if(++count>1500)throw Error('Terlalu banyak elemen untuk preview.')
        if(v()==='import'||v()==='package'){while(p<tokens.length&&v()!=='\n')p++;continue}
        if(v()==='@'){p+=2;if(v()==='(')group();continue}
        if(v()==='private'||v()==='public'){p++;continue}
        if(v()==='fun') {p++;p++;if(v()==='('&&group().trim())throw Error('Parameter composable kustom belum didukung. Gunakan fungsi tanpa parameter dan state lokal.');skip();if(v()!== '{')throw Error(`Baris ${t.line}: gunakan fungsi @Composable dengan blok { }.`);p++;nodes.push(...body('}',depth+1));p++;continue}
        if(v()==='val'||v()==='var') {
          p++;const name=v();p++;let declaration=expression(true)
          if(['__proto__','constructor','prototype'].includes(name))throw Error('Nama variabel ini tidak didukung.')
          const state=declaration.match(/^by\s+remember(?:Saveable)?\s*\{\s*mutable(?:Int|Float)?StateOf\(([\s\S]*)\)\s*\}$/)
          if(state)initialState[name]=evaluate(state[1],initialState)
          else if(/^\s*(?::\s*\w+\??\s*)?=/.test(declaration)) initialState[name]=evaluate(declaration.replace(/^\s*(?::\s*\w+\??\s*)?=\s*/,''),initialState)
          else throw Error(`Baris ${t.line}: deklarasi belum didukung. Gunakan val x = ... atau var x by remember { mutableStateOf(...) }.`)
          continue
        }
        if(v()==='if') {p++;skip();if(v()!=='(')throw Error(`Baris ${t.line}: if membutuhkan kondisi.`);const condition=group();skip();if(v()!=='{')throw Error('Gunakan blok { } untuk if.');p++;const children=body('}',depth+1);p++;skip();let alternate=[];if(v()==='else'){p++;skip();if(v()!=='{')throw Error('Gunakan blok { } untuk else.');p++;alternate=body('}',depth+1);p++}nodes.push({type:'If',args:{condition},children,alternate,line:t.line});continue}
        if(v()==='item'||v()==='items') {
          const type=v();p++;let collection='';if(v()==='(')collection=group();skip();if(v()!=='{')throw Error('item/items membutuhkan blok UI.');p++;skip();let alias='it';if(tokens[p+1]?.v==='->'){alias=v();p+=2} const children=body('}',depth+1);p++;nodes.push({type:type==='item'?'Group':'Items',args:{collection,alias},children,line:t.line});continue
        }
        const type=v();p++; const args={};let idx=0
        if(v()==='(') {p++;skip();while(p<tokens.length&&v()!==')'){let key=positional[type]?.[idx]??`arg${idx}`;if(tokens[p+1]?.v==='='){key=v();p+=2}args[key]=expression();idx++;if(v()===',')p++;skip()}p++;}
        skip();let children=[];if(v()==='{'){p++;skip();if(tokens[p+1]?.v==='->'){warnings.push(`Baris ${t.line}: parameter padding Scaffold disimulasikan.`);initialState[v()]=0;p+=2}children=body('}',depth+1);p++}
        if(!known.has(type)) throw Error(`Baris ${t.line}: ${type} belum didukung oleh simulator. Lihat daftar dukungan.`)
        for(const key of Object.keys(args))if(!supportedArgs.has(key))warnings.push(`Baris ${t.line}: parameter ${key} pada ${type} belum disimulasikan.`)
        if(args.modifier) for(const m of args.modifier.matchAll(/\.([a-zA-Z]+)\(/g))if(!modifiers.has(m[1]))warnings.push(`Modifier .${m[1]} belum disimulasikan.`)
        if(args.modifier?.includes('verticalScroll')||args.modifier?.includes('horizontalScroll'))warnings.push('Scroll disimulasikan oleh browser, tanpa physics Android.')
        nodes.push({type,args,children,line:t.line})
      }
      return nodes
    }
    const nodes=body(undefined)
    function estimate(nodes,multiplier=1){let total=0;for(const node of nodes){total+=multiplier;const next=node.type==='Items'?multiplier*60:multiplier;total+=estimate(node.children??[],next)+estimate(node.alternate??[],multiplier);if(total>4000)throw Error('Kombinasi list terlalu besar untuk preview. Kurangi jumlah atau tingkat items.')}return total}
    estimate(nodes)
    if(!nodes.length)throw Error('Tambahkan komponen UI seperti Text("Halo Kotlin!").')
    return {nodes,initialState,warnings:[...new Set(warnings)],error:null}
  }catch(e){return {nodes:[],initialState:{},warnings:[],error:e.message}}
}

export function splitTop(source,separator=',') {
  const result=[];let start=0,depth=0,quoted=false
  for(let i=0;i<source.length;i++){const c=source[i];if(c==='\\'&&quoted){i++;continue}if(c==='"')quoted=!quoted;if(quoted)continue;if('({['.includes(c))depth++;if(')}]'.includes(c))depth--;if(depth===0&&source.slice(i,i+separator.length)===separator){result.push(source.slice(start,i).trim());start=i+separator.length;i+=separator.length-1}}
  result.push(source.slice(start).trim());return result
}
export function evaluate(raw,state={}) {
  let s=String(raw??'').trim();if(!s)return ''
  if(s.startsWith('{')&&s.endsWith('}'))return evaluate(s.slice(1,-1),state)
  if(s.startsWith('(')&&s.endsWith(')'))return evaluate(s.slice(1,-1),state)
  for(const op of ['?:','||','&&','==','!=','>=','<=','>','<',' + ',' - ',' * ']) {
    const parts=splitTop(s,op);if(parts.length===2){const a=evaluate(parts[0],state),b=evaluate(parts[1],state);switch(op){case '?:':return a??b;case '||':return a||b;case '&&':return a&&b;case '==':return a===b;case '!=':return a!==b;case '>=':return a>=b;case '<=':return a<=b;case '>':return a>b;case '<':return a<b;case ' + ':return a+b;case ' - ':return a-b;case ' * ':if(typeof a!=='number'||typeof b!=='number')throw Error('Perkalian membutuhkan angka.');return a*b}}
  }
  if(s.startsWith('!'))return !evaluate(s.slice(1),state)
  if(s.startsWith('"')&&s.endsWith('"'))return s.slice(1,-1).replace(/\\n/g,'\n').replace(/\\"/g,'"').replace(/\$\{([^}]+)\}|\$([A-Za-z_]\w*)/g,(_,a,b)=>String(evaluate(a??b,state)))
  if(s==='true'||s==='false')return s==='true';if(s==='null')return null
  if(/^-?\d+(?:\.\d+)?(?:f|L|\.dp|\.sp)?$/.test(s))return parseFloat(s)
  if(/^TopAppBarDefaults\.exitUntilCollapsedScrollBehavior\((?:rememberTopAppBarState\(\))?\)$/.test(s))return {kind:'exitUntilCollapsed'}
  if(s.startsWith('listOf(')&&s.endsWith(')'))return splitTop(s.slice(7,-1)).filter(Boolean).map(x=>evaluate(x,state))
  if(Object.hasOwn(state,s))return state[s]
  if(/\.isNotEmpty\(\)$/.test(s))return String(evaluate(s.replace(/\.isNotEmpty\(\)$/, ''),state)).length>0
  if(/\.isEmpty\(\)$/.test(s))return String(evaluate(s.replace(/\.isEmpty\(\)$/, ''),state)).length===0
  const contains=s.match(/^(.+)\.contains\(([\s\S]*)\)$/);if(contains)return String(evaluate(contains[1],state)).includes(String(evaluate(contains[2],state)))
  if(/\.length$/.test(s))return String(evaluate(s.replace(/\.length$/, ''),state)).length
  if(/\.toInt\(\)$/.test(s))return Math.trunc(Number(evaluate(s.replace(/\.toInt\(\)$/, ''),state)))
  if(/\.uppercase\(\)$/.test(s))return String(evaluate(s.replace(/\.uppercase\(\)$/, ''),state)).toUpperCase()
  throw Error(`Ekspresi belum didukung: ${s.slice(0,100)}`)
}

export function applyAction(action,state,input) {
  const body=String(action??'').trim().replace(/^\{([\s\S]*)\}$/,'$1').trim()
  const next={...state}
  for(const statement of splitTop(body,';').flatMap(x=>splitTop(x,'\n')).map(x=>x.trim()).filter(Boolean)) {
    let m=statement.match(/^(\w+)\s*(\+\+|--)$/)
    if(m){if(!Object.hasOwn(next,m[1]))throw Error(`State ${m[1]} tidak ditemukan.`);next[m[1]]+=m[2]==='++'?1:-1;continue}
    m=statement.match(/^(\w+)\s*(=|\+=|-=)\s*([\s\S]+)$/)
    if(!m||!Object.hasOwn(next,m[1]))throw Error(`Aksi belum didukung: ${statement}`)
    const value=evaluate(m[3],{...next,it:input});next[m[1]]=m[2]==='='?value:m[2]==='+='?next[m[1]]+value:next[m[1]]-value
  }
  return next
}

export function colorValue(value) {
  const hex=value?.match(/Color\(0x(?:FF)?([A-Fa-f0-9]{6})\)/)?.[1];if(hex)return '#'+hex
  const map={'Color.White':'#ffffff','Color.Black':'#191c24','Color.Red':'#e65364','Color.Blue':'#536df0','Color.Green':'#2d9c76','Color.Gray':'#838896','Color.Transparent':'transparent','MaterialTheme.colorScheme.primary':'var(--phone-primary)','MaterialTheme.colorScheme.onPrimary':'#ffffff','MaterialTheme.colorScheme.surface':'var(--phone-surface)','MaterialTheme.colorScheme.background':'var(--phone-bg)','MaterialTheme.colorScheme.onSurface':'var(--phone-text)','MaterialTheme.colorScheme.primaryContainer':'var(--phone-soft)'}
  return map[value]??null
}
export function modifierStyle(raw='',state={}) {
  const style={};const number=x=>Math.max(0,Math.min(800,Number(evaluate(x,state))||0))
  for(const m of raw.matchAll(/\.(padding|height|width|size|weight|alpha)\(([^()]*)\)/g)) {
    const [,name,arg]=m
    if(name==='padding'){const parts=splitTop(arg);if(parts.some(x=>x.includes('='))){for(const part of parts){const [key,value]=part.split('=').map(x=>x.trim());for(const side of ({horizontal:['Left','Right'],vertical:['Top','Bottom'],top:['Top'],bottom:['Bottom'],start:['Left'],end:['Right']}[key]??[]))style['padding'+side]=number(value)+'px'}}else style.padding=parts.map(x=>number(x)+'px').join(' ')}
    else if(name==='size'){style.width=number(arg)+'px';style.height=number(arg)+'px'}
    else if(name==='weight')style.flex=number(arg)
    else if(name==='alpha')style.opacity=Math.min(1,number(arg))
    else style[name]=number(arg)+'px'
  }
  if(raw.includes('.fillMaxWidth(')||raw.includes('.fillMaxSize('))style.width='100%'
  if(raw.includes('.fillMaxHeight(')||raw.includes('.fillMaxSize('))style.height='100%'
  const bg=raw.match(/\.background\((Color\(0x[\da-fA-F]+\)|[\w.]+)\)/)?.[1];if(bg)style.background=colorValue(bg)
  const radius=raw.match(/(?:clip\(RoundedCornerShape|border\([^\n]*RoundedCornerShape)\((\d+)\.dp\)/)?.[1];if(radius)style.borderRadius=radius+'px'
  if(raw.includes('CircleShape'))style.borderRadius='50%'
  const border=raw.match(/\.border\(([^,]+),\s*(Color\(0x[\da-fA-F]+\)|[\w.]+)/);if(border)style.border=`${number(border[1])}px solid ${colorValue(border[2])??'currentColor'}`
  const minimum=raw.match(/\.defaultMinSize\(([^()]*)\)/)?.[1];if(minimum)for(const part of splitTop(minimum)){const [key,value]=part.split('=').map(x=>x.trim());if(['minWidth','minHeight'].includes(key))style[key]=number(value)+'px'}
  if(raw.includes('.verticalScroll(')){style.overflowY='auto';style.maxHeight='100%'}
  if(raw.includes('.horizontalScroll('))style.overflowX='auto'
  return style
}
