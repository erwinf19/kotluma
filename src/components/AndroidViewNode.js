import CollapsingSurface from './CollapsingSurface.js'
import { defineComponent, h } from 'vue'
import { User, Star, Heart, Plus, Search, Home, Settings, Mail, ShoppingBag, Coffee, Bell, BookOpen } from 'lucide-vue-next'
const icons={ic_menu_myplaces:User,btn_star_big_on:Star,ic_menu_add:Plus,ic_menu_search:Search,ic_menu_view:Home,ic_menu_preferences:Settings,ic_dialog_email:Mail,ic_menu_send:ShoppingBag,ic_menu_info_details:BookOpen,ic_dialog_info:Bell,ic_menu_compass:Coffee,ic_menu_agenda:Heart}
const colorMap={'?attr/colorPrimary':'var(--phone-primary)','?attr/colorOnSurface':'var(--phone-text)','?android:attr/textColorPrimary':'var(--phone-text)','?android:attr/colorBackground':'var(--phone-bg)','@android:color/white':'#fff','@android:color/black':'#191c24','@android:color/transparent':'transparent'}
export function xmlColor(value){if(!value)return undefined;if(colorMap[value])return colorMap[value];if(/^#[0-9a-f]{3,8}$/i.test(value)){if(value.length===9)return '#'+value.slice(3)+value.slice(1,3);return value}throw Error(`Resource warna ${value} belum tersedia. Gunakan #RRGGBB atau warna tema yang didukung.`)}
const dimension=value=>{if(value==='match_parent'||value==='fill_parent')return '100%';if(value==='wrap_content')return 'fit-content';if(/^-?\d+(?:\.\d+)?(?:dp|sp|px)$/.test(value))return Math.max(0,Math.min(1000,parseFloat(value)))+'px';throw Error(`Dimensi ${value} belum didukung.`)}
const last=s=>s.split('.').at(-1)
export function xmlStyle(node,state,parent){
  const a=node.attrs,v=state.views[node.id]??{},style={};const isHorizontal=parent?.attrs.orientation==='horizontal'
  if(a.layout_width)style.width=dimension(a.layout_width)
  if(a.layout_height)style.height=dimension(a.layout_height)
  if(parent?.type==='GridLayout'&&a.layout_columnWeight)style.width='100%'
  if(parent?.type==='FrameLayout'&&a.layout_gravity?.includes('center'))style.justifySelf='center'
  if(a.layout_width==='wrap_content')style.maxWidth='100%'
  if(a.layout_height==='wrap_content')style.height='auto'
  if(a.layout_weight){style.flexGrow=Number(a.layout_weight);style.flexBasis='0px';if(isHorizontal)style.width='0px';else style.height='0px'}
  for(const [attr,css] of [['padding','padding'],['layout_margin','margin'],['contentPadding','padding'],['paddingHorizontal','paddingInline'],['paddingVertical','paddingBlock'],['layout_marginHorizontal','marginInline'],['layout_marginVertical','marginBlock']])if(a[attr])style[css]=dimension(a[attr])
  for(const [suffix,side] of [['Top','Top'],['Bottom','Bottom'],['Start','Left'],['End','Right'],['Left','Left'],['Right','Right']]){if(a['padding'+suffix])style['padding'+side]=dimension(a['padding'+suffix]);if(a['layout_margin'+suffix])style['margin'+side]=dimension(a['layout_margin'+suffix])}
  if(a.background&&!a.background.startsWith('@drawable'))style.background=xmlColor(a.background)
  if(a.backgroundTint)style.background=xmlColor(a.backgroundTint)
  if(a.cardBackgroundColor)style.background=xmlColor(a.cardBackgroundColor)
  if(a.chipBackgroundColor)style.background=xmlColor(a.chipBackgroundColor)
  if(a.textColor)style.color=xmlColor(a.textColor)
  if(a.textSize)style.fontSize=dimension(a.textSize)
  if(a.textStyle?.includes('bold'))style.fontWeight='700'
  if(a.textStyle?.includes('italic'))style.fontStyle='italic'
  if(a.textAllCaps==='true')style.textTransform='uppercase'
  if(a.textAlignment==='center')style.textAlign='center'
  if(a.minWidth)style.minWidth=dimension(a.minWidth)
  if(a.minHeight)style.minHeight=dimension(a.minHeight)
  const radius=a.cardCornerRadius??a.cornerRadius??a.chipCornerRadius;if(radius)style.borderRadius=dimension(radius)
  if(a.strokeWidth)style.border=`${dimension(a.strokeWidth)} solid ${xmlColor(a.strokeColor)??'currentColor'}`
  if(a.maxLines){style.display='-webkit-box';style.WebkitLineClamp=Number(a.maxLines);style.WebkitBoxOrient='vertical';style.overflow='hidden'}
  if(v.visibility==='gone')style.display='none';else if(v.visibility==='invisible')style.visibility='hidden'
  style.opacity=v.alpha??1
  if(a.gravity){const value=a.gravity;const primary=value.includes('center')?'center':value.includes('bottom')?'flex-end':'flex-start';const secondary=value.includes('center')?'center':value.includes('end')?'flex-end':'flex-start';if(['LinearLayout','RadioGroup','ChipGroup'].includes(last(node.type))){style.justifyContent=a.orientation==='horizontal'?secondary:primary;style.alignItems=a.orientation==='horizontal'?primary:secondary}else{style.textAlign=value.includes('center')?'center':value.includes('end')?'right':'left';if(last(node.type)==='FrameLayout'){style.alignItems=primary;style.justifyItems=secondary}}}
  if(a.layout_gravity){style.alignSelf=a.layout_gravity.includes('center')?'center':a.layout_gravity.includes('end')?'flex-end':'flex-start'}
  return style
}
const AndroidViewNode=defineComponent({name:'AndroidViewNode',props:{node:Object,state:Object,parent:Object,scrollInfo:Object,coordinated:Boolean},emits:['event'],setup(props,{emit}){
  return ()=>{
    const n=props.node,a=n.attrs,v=props.state.views[n.id]??{},type=last(n.type)
    const send=(event,value,extra={})=>emit('event',{viewId:n.id,type:event,value,...extra})
    const children=()=>n.children.map(node=>h(AndroidViewNode,{node,state:props.state,parent:n,scrollInfo:props.scrollInfo,key:node.id,onEvent:e=>emit('event',e)}))
    try{
      const base={class:['android-view','android-'+type,a.orientation==='horizontal'?'horizontal':'',a.layout_behavior?.includes('bottom_sheet')?'android-sheet':''],style:xmlStyle(n,props.state,props.parent),'data-view-id':n.id}
      if(props.coordinated){base.style.height='auto';base.style.overflow='visible';base.style.flex='none'}
      const info=props.scrollInfo??{offset:0,progress:0}
      if(a.layout_collapseMode==='parallax')base.style.transform=`translateY(${info.offset*Math.max(0,Math.min(1,Number(a.layout_collapseParallaxMultiplier??0.5)))}px)`
      if(type==='CoordinatorLayout'){
        const header=n.children.find(child=>last(child.type)==='AppBarLayout')
        const content=n.children.find(child=>['NestedScrollView','RecyclerView'].includes(last(child.type)))
        if(header&&content){
          if(n.children.length!==2)throw Error('Contoh collapsing CoordinatorLayout mendukung satu AppBarLayout dan satu konten scroll.')
          const collapsing=header.children.find(child=>last(child.type)==='CollapsingToolbarLayout')
          const toolbar=collapsing?.children.find(child=>last(child.type)==='Toolbar')
          const expanded=Math.max(56,Math.min(600,parseFloat(header.attrs.layout_height)||240))
          const collapsed=Math.min(expanded,Math.max(40,parseFloat(toolbar?.attrs.layout_height)||56))
          const enabled=collapsing?.attrs.layout_scrollFlags==='scroll|exitUntilCollapsed'&&content.attrs.layout_behavior==='@string/appbar_scrolling_view_behavior'&&content.attrs.nestedScrollingEnabled!=='false'
          return h(CollapsingSurface,{expandedHeight:expanded,collapsedHeight:collapsed,enabled,label:a.contentDescription??'CoordinatorLayout — scroll untuk menciutkan header',onScroll:y=>emit('event',{viewId:content.id,type:'scroll',value:Math.round(y)})},{header:scrollInfo=>h(AndroidViewNode,{node:header,state:props.state,scrollInfo,onEvent:e=>emit('event',e)}),default:()=>h(AndroidViewNode,{node:content,state:props.state,coordinated:true,onEvent:e=>emit('event',e)})})
        }
      }
      if(type==='CollapsingToolbarLayout')return h('div',{...base,class:[...base.class,'android-collapsing-toolbar']},[...children(),h('div',{class:'android-header-scrim',style:{opacity:info.progress,background:xmlColor(a.contentScrim)??'var(--phone-soft)'}}),h('div',{class:'android-collapsing-title',style:{fontSize:(30-10*info.progress)+'px'}},a.title??'')])
      if(type==='Toolbar')return h('div',{...base,class:[...base.class,'android-pinned-toolbar']},a.title??'')
      if(type==='RecyclerView'){
        const columns=v.columns??1,style=v.adapterStyle??{padding:16,textSize:16}
        base.style.display='grid';base.style.gridTemplateColumns=`repeat(${columns},minmax(0,1fr))`;base.style.alignContent='start'
        if(!v.items)return h('div',base,h('small',{class:'android-list-empty'},'Hubungkan layoutManager dan TextListAdapter pada tab Kotlin.'))
        return h('div',{...base,role:'list','aria-label':a.contentDescription??'RecyclerView'},v.items.map((item,index)=>h('div',{class:'android-recycler-item',role:'listitem',key:index,style:{padding:style.padding+'px',fontSize:style.textSize+'px'}},item)))
      }
      const text=String(v.text??a.text??'').replace(/\\n/g,'\n')
      if(['AppBarLayout','NestedScrollView','LinearLayout','RadioGroup','FrameLayout','CoordinatorLayout','ScrollView','HorizontalScrollView','GridLayout','CardView','MaterialCardView','ChipGroup'].includes(type)){
        if(type==='GridLayout'){base.style.gridTemplateColumns=`repeat(${Math.min(6,Math.max(1,Number(a.columnCount)||2))},minmax(0,1fr))` }
        if(['ScrollView','NestedScrollView'].includes(type)&&a.fillViewport==='true')base.class.push('fill-viewport')
        if(type==='NestedScrollView'&&!props.coordinated){base.onScroll=e=>send('scroll',Math.round(e.target.scrollTop));base.tabindex=0;base.role='region';base['aria-label']=a.contentDescription??'NestedScrollView'}
        return h('div',base,children())
      }
      if(type==='BottomNavigationView')return h('nav',{...base,'aria-label':a.contentDescription??'Bottom navigation'},(v.menu??[]).map(item=>h('button',{type:'button',class:{'is-selected':v.selectedItemId===item.id},'aria-current':v.selectedItemId===item.id?'page':undefined,disabled:v.enabled===false,onClick:()=>send('navigation',item.id)},[h('span',{class:'android-nav-icon'},h(icons[item.icon]??Home,{size:23})),h('span',{},String(item.title))])))
      if(type==='TextView')return h('div',base,text)
      if(['Button','MaterialButton','ImageButton','Chip'].includes(type))return h('button',{...base,type:'button',disabled:v.enabled===false,'aria-label':a.contentDescription||undefined,onClick:()=>send('click')},type==='ImageButton'?h(icons[a.src?.split('/').at(-1)]??Plus,{size:22}):text)
      if(type==='ImageView'){const Icon=icons[a.src?.split('/').at(-1)];if(!Icon)throw Error(`Drawable ${a.src??'(kosong)'} belum tersedia. Gunakan ikon @android:drawable dari contoh.`);return h('div',{...base,role:'img','aria-label':a.contentDescription??'Ilustrasi'},[h(Icon,{size:Math.min(56,parseInt(a.layout_width)||32),color:xmlColor(a.tint)??'var(--phone-primary)'})])}
      if(type==='EditText')return h('input',{...base,'aria-label':a.contentDescription??a.hint??n.id,type:a.inputType?.includes('Password')?'password':a.inputType?.includes('number')?'number':a.inputType?.includes('Email')?'email':'text',value:v.text,placeholder:a.hint,disabled:v.enabled===false,onInput:e=>send('text',e.target.value)})
      if(['Switch','SwitchMaterial','CheckBox','RadioButton'].includes(type)){
        const radio=type==='RadioButton',group=last(props.parent?.type??'')==='RadioGroup'?props.parent:null
        return h('label',base,[h('input',{type:radio?'radio':'checkbox',role:type.startsWith('Switch')?'switch':undefined,'aria-label':text||a.contentDescription||n.id,checked:v.checked,disabled:v.enabled===false,name:radio?group?.id:undefined,onChange:e=>send('change',e.target.checked,group?{siblings:group.children.map(x=>x.id),listenerId:group.id,listenerValue:n.id}:{})}),h('span',{},text)])
      }
      if(type==='SeekBar')return h('input',{...base,type:'range','aria-label':a.contentDescription??'SeekBar',value:v.progress,min:0,max:Number(a.max??100),disabled:v.enabled===false,onInput:e=>send('progress',Number(e.target.value))})
      if(type==='ProgressBar'){if(a.indeterminate==='true'||!a.style?.includes('Horizontal'))return h('span',{...base,class:[...base.class,'android-spinner'],'aria-label':'Memuat',role:'status'});return h('progress',{...base,'aria-label':'Progress',max:Number(a.max??100),value:v.progress})}
      if(type==='ListView')return h('div',base,Array.isArray(v.items)?v.items.slice(0,60).map((item,index)=>h('button',{type:'button',class:'android-list-item',onClick:()=>send('item',index)},String(item))):h('small',{class:'android-list-empty'},'Hubungkan ArrayAdapter di tab Kotlin untuk mengisi list.'))
      if(type==='View'||type==='Space')return h('div',base)
      return h('small',{class:'compose-unsupported'},`View ${type} belum didukung.`)
    }catch(error){return h('div',{class:'compose-unsupported'},`XML ${n.id}: ${error.message}`)}
  }
}})
export default AndroidViewNode
