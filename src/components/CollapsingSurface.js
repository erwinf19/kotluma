import { defineComponent, computed, ref, h } from 'vue'
import { collapseProgress } from '../engine/scroll.js'
export default defineComponent({
  name:'CollapsingSurface',
  props:{expandedHeight:{type:Number,default:240},collapsedHeight:{type:Number,default:56},label:{type:String,default:'Konten dengan collapsing header'},enabled:{type:Boolean,default:true}},
  emits:['scroll'],
  setup(props,{slots,emit}){
    const scrollY=ref(0)
    const info=computed(()=>collapseProgress(props.enabled?scrollY.value:0,props.expandedHeight,props.enabled?props.collapsedHeight:props.expandedHeight))
    return ()=>h('div',{class:'collapsing-surface',tabindex:0,role:'region','aria-label':props.label,onScroll:event=>{scrollY.value=event.target.scrollTop;emit('scroll',scrollY.value)}},[
      h('div',{class:'collapsing-header',style:{height:props.expandedHeight+'px',top:-info.value.range+'px'},'data-collapse-progress':info.value.progress.toFixed(3)},slots.header?.(info.value)),
      h('div',{class:'collapsing-content',style:{minHeight:`calc(100% - ${props.collapsedHeight}px)`}},slots.default?.())
    ])
  }
})
