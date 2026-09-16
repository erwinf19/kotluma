import CollapsingSurface from './CollapsingSurface.js'
import { defineComponent, h, Transition } from 'vue'
import { Heart, ArrowLeft, ArrowRight, Check, Plus, Search, Home, User, Settings, Bell, Star, MoreHorizontal, Menu, ShoppingBag, ChevronRight, Coffee, Mail, Lock, Sun, Trash2, X, BookOpen, Sparkles, Play, Send, Share2, Bookmark } from 'lucide-vue-next'
import { evaluate, modifierStyle, colorValue, parseCompose, splitTop } from '../engine/compose.js'
const icons={Favorite:Heart,ArrowBack:ArrowLeft,ArrowForward:ArrowRight,Check,Add:Plus,Search,Home,Person:User,Settings,Notifications:Bell,Star,MoreVert:MoreHorizontal,Menu,ShoppingCart:ShoppingBag,ChevronRight,Coffee,Email:Mail,Lock,LightMode:Sun,Delete:Trash2,Close:X,Book:BookOpen,AutoAwesome:Sparkles,PlayArrow:Play,Send,Share:Share2,Bookmark}
const alignment={CenterHorizontally:'center',CenterVertically:'center',Center:'center',Start:'flex-start',End:'flex-end',Top:'flex-start',Bottom:'flex-end',SpaceBetween:'space-between',SpaceEvenly:'space-evenly',SpaceAround:'space-around'}
const tail=s=>s?.split('.').at(-1)
const Node=defineComponent({name:'PreviewNode',props:{node:Object,state:Object,scrollInfo:Object,coordinated:Boolean},emits:['action'],setup(props,{emit}){
  return ()=>{
    const n=props.node,a=n.args,s=props.state
    const ev=(key,fallback)=>a[key]===undefined?fallback:evaluate(a[key],s)
    const action=(raw,input)=>emit('action',{raw,input})
    const renderNodes=(nodes,state=s,options={})=>nodes.map((node,i)=>h(Node,{node,state,scrollInfo:props.scrollInfo,coordinated:props.coordinated,...options,key:`${node.line}-${i}`,onAction:event=>emit('action',event)}))
    const children=()=>renderNodes(n.children??[])
    const slot=key=>{if(!a[key])return [];const result=parseCompose(a[key].trim().replace(/^\{([\s\S]*)\}$/,'$1'));return result.error?[h('small',{class:'compose-unsupported'},result.error)]:renderNodes(result.nodes)}
    try {
      const style=modifierStyle(a.modifier,s)
      if(props.coordinated&&['Column','LazyColumn'].includes(n.type)){style.height='auto';style.maxHeight='none';style.overflowY='visible'}
      if(a.color||a.tint){const color=colorValue(a.color??a.tint);if(!color)throw Error(`Warna belum didukung: ${a.color}`);style.color=color}
      const click=a.modifier?.match(/\.clickable\s*\{([^}]+)\}/)?.[1]
      const base={class:`compose-node compose-${n.type}`,style,onClick:click?()=>action(click):undefined}
      if(n.type==='Group')return h('div',base,children())
      if(n.type==='If')return renderNodes(evaluate(a.condition,s)?n.children:n.alternate)
      if(n.type==='Items') {const source=evaluate(a.collection,s);const items=typeof source==='number'?Array.from({length:Math.max(0,Math.min(source,60))},(_,i)=>i):source;if(!Array.isArray(items))throw Error('items membutuhkan jumlah atau listOf.');return items.slice(0,60).flatMap(item=>renderNodes(n.children,{...s,[a.alias]:item}))}
      if(n.type==='Text') {
        if(a.fontSize)style.fontSize=ev('fontSize')+'px'
        if(a.fontWeight)style.fontWeight={Bold:700,SemiBold:600,Medium:500,Normal:400,Light:300}[tail(a.fontWeight)]??400
        if(a.textAlign)style.textAlign=tail(a.textAlign).toLowerCase()
        if(a.style){const name=tail(a.style);const sizes={headlineLarge:32,headlineMedium:28,headlineSmall:24,titleLarge:22,titleMedium:16,titleSmall:14,bodyLarge:16,bodyMedium:14,bodySmall:12,labelLarge:14,labelMedium:12,labelSmall:11};style.fontSize=(sizes[name]??14)+'px';if(name.startsWith('title')||name.startsWith('headline'))style.fontWeight=600}
        return h('span',base,String(ev('text','')))
      }
      if(['Column','Row','Box','LazyColumn','LazyRow','LazyVerticalGrid','NavigationBar','TabRow','Card','ElevatedCard','Surface','BadgedBox'].includes(n.type)) {
        const arrangement=a.verticalArrangement??a.horizontalArrangement
        const gap=arrangement?.match(/spacedBy\(([^)]+)\)/)?.[1];if(gap){style.rowGap=evaluate(gap,s)+'px';style.columnGap=evaluate(a.horizontalArrangement?.match(/spacedBy\(([^)]+)\)/)?.[1]??gap,s)+'px'}else if(arrangement)style.justifyContent=alignment[tail(arrangement)]
        const align=a.horizontalAlignment??a.verticalAlignment??a.contentAlignment;if(align)style.alignItems=alignment[tail(align)]
        if(n.type==='LazyVerticalGrid')style.gridTemplateColumns=`repeat(${Math.min(6,Number(a.columns?.match(/Fixed\((\d+)\)/)?.[1])||2)}, minmax(0, 1fr))`
        if(a.shape)style.borderRadius=(a.shape.match(/(\d+)\.dp/)?.[1]??18)+'px'
        const container=a.colors?.match(/containerColor\s*=\s*(Color\(0x[\da-fA-F]+\)|[\w.]+)/)?.[1];if(container)style.background=colorValue(container)
        return h('div',base,children())
      }
      if(n.type==='Scaffold'&&a.topBar){
        const barTree=parseCompose(a.topBar.trim().replace(/^\{([\s\S]*)\}$/,'$1'))
        const bar=barTree.nodes.find(node=>node.type==='LargeTopAppBar')
        if(bar){
          if(a.bottomBar||a.floatingActionButton)throw Error('Simulasi LargeTopAppBar saat ini memakai Scaffold tanpa bottomBar/FAB.')
          const behavior=bar.args.scrollBehavior?.trim()
          const enabled=!!behavior&&s[behavior]?.kind==='exitUntilCollapsed'&&a.modifier?.replace(/\s/g,'').includes(`.nestedScroll(${behavior}.nestedScrollConnection)`)
          return h(CollapsingSurface,{expandedHeight:152,collapsedHeight:64,enabled,label:'Compose — scroll untuk menciutkan header'},{header:scrollInfo=>renderNodes(barTree.nodes,s,{scrollInfo}),default:()=>renderNodes(n.children,s,{coordinated:true})})
        }
      }
      if(n.type==='LargeTopAppBar')return h('div',{...base,class:'compose-large-app-bar'},[h('div',{class:'compose-large-app-title',style:{fontSize:(28-8*(props.scrollInfo?.progress??0))+'px'}},slot('title'))])
      if(n.type==='Scaffold')return h('div',base,[h('div',{class:'scaffold-top'},slot('topBar')),h('div',{class:'scaffold-body'},children()),h('div',{class:'scaffold-fab'},slot('floatingActionButton')),h('div',{class:'scaffold-bottom'},slot('bottomBar'))])
      if(n.type==='Spacer')return h('div',base)
      if(n.type==='Icon') {const name=tail(a.imageVector??a.arg0);const I=icons[name];if(!I)throw Error(`Ikon ${name} belum didukung.`);return h(I,{...base,size:style.width?parseInt(style.width):22,'aria-label':ev('contentDescription',null)??undefined,'aria-hidden':!ev('contentDescription',null)})}
      if(['Button','OutlinedButton','TextButton','IconButton','FloatingActionButton','FilterChip','AssistChip','SuggestionChip','Tab','NavigationBarItem'].includes(n.type))return h('button',{...base,type:'button',class:[base.class,ev('selected',false)?'is-selected':''],disabled:!ev('enabled',true),'aria-pressed':['FilterChip','Tab','NavigationBarItem'].includes(n.type)?ev('selected',false):undefined,onClick:()=>action(a.onClick)},[...slot('icon'),...slot('leadingIcon'),...children(),...slot('label'),...slot('text')])
      if(['TextField','OutlinedTextField'].includes(n.type))return h('label',base,[h('span',{class:'compose-field-label'},slot('label')),h('input',{value:ev('value',''),disabled:!ev('enabled',true),type:a.visualTransformation?.includes('Password')?'password':'text',placeholder:a.placeholder?.match(/Text\("([^"]*)"\)/)?.[1]??'',onInput:e=>action(a.onValueChange,e.target.value)})])
      if(['Switch','Checkbox','RadioButton'].includes(n.type))return h('input',{...base,type:n.type==='RadioButton'?'radio':'checkbox',role:n.type==='Switch'?'switch':undefined,'aria-label':n.type,checked:ev(n.type==='RadioButton'?'selected':'checked',false),disabled:!ev('enabled',true),onChange:e=>action(a.onCheckedChange??a.onClick,e.target.checked)})
      if(n.type==='Slider') {const range=splitTop(a.valueRange??'0f..1f','..').map(x=>evaluate(x,s));return h('input',{...base,type:'range','aria-label':'Slider',min:range[0],max:range[1],step:a.steps?((range[1]-range[0])/(ev('steps')+1)):'any',value:ev('value',0),onInput:e=>action(a.onValueChange,Number(e.target.value))})}
      if(n.type==='HorizontalDivider')return h('hr',base)
      if(n.type==='LinearProgressIndicator')return h('progress',{...base,max:1,value:a.progress===undefined?undefined:ev('progress'), 'aria-label':'Progress'})
      if(n.type==='CircularProgressIndicator')return h('span',{...base,role:'status','aria-label':'Memuat'})
      if(n.type==='TopAppBar')return h('div',base,[h('div',{},slot('navigationIcon')),h('strong',{},slot('title')),h('div',{},slot('actions'))])
      if(n.type==='Badge')return h('span',base,children())
      if(n.type==='AlertDialog'||n.type==='ModalBottomSheet')return h('div',{class:'compose-overlay',onClick:()=>action(a.onDismissRequest)},[h('section',{...base,role:'dialog','aria-label':n.type,onClick:e=>e.stopPropagation()},n.type==='AlertDialog'?[h('h3',{},slot('title')),h('div',{},slot('text')),h('footer',{},[...slot('dismissButton'),...slot('confirmButton')])]:[h('button',{class:'sheet-close','aria-label':'Tutup bottom sheet',onClick:()=>action(a.onDismissRequest)},'×'),...children()])])
      if(n.type==='AnimatedVisibility')return h(Transition,{name:'compose-fade'},()=>ev('visible',true)?h('div',base,children()):null)
      return h('small',{class:'compose-unsupported'},`${n.type} belum didukung.`)
    }catch(error){return h('div',{class:'compose-unsupported',role:'status'},`Baris ${n.line}: ${error.message}`)}
  }
}})
export default Node
