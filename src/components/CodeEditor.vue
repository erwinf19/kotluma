<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { StreamLanguage, HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { xml } from '@codemirror/legacy-modes/mode/xml'
import { kotlin } from '@codemirror/legacy-modes/mode/clike'
const props=defineProps({modelValue:String,dark:Boolean,language:{type:String,default:'kotlin'}})
const emit=defineEmits(['update:modelValue','cursor'])
const host=ref(null);let view
const appearance=new Compartment()
const darkHighlight=syntaxHighlighting(HighlightStyle.define([
  {tag:[tags.keyword,tags.modifier],color:'#c7acff'},
  {tag:[tags.string,tags.attributeValue],color:'#abd9bc'},
  {tag:[tags.number,tags.bool],color:'#edc091'},
  {tag:[tags.comment,tags.meta],color:'#a4a5b7'},
  {tag:[tags.typeName,tags.className,tags.tagName],color:'#a6cbee'},
  {tag:[tags.attributeName,tags.propertyName],color:'#d7bce9'},
  {tag:[tags.variableName,tags.operator,tags.punctuation],color:'#e0dfe9'},
]))
function editorAppearance(){return props.dark?[EditorView.theme({
  '&':{background:'#282934',color:'#e0dfe9'},'.cm-gutters':{background:'#282934',color:'#9396aa'},
  '.cm-activeLine':{background:'#333243'},'.cm-activeLineGutter':{background:'#333243',color:'#c7acff'},
  '.cm-cursor':{borderLeftColor:'#c7acff'},'.cm-selectionBackground':{background:'#514669 !important'},
  '.cm-panels,.cm-tooltip':{background:'#343442',color:'#e0dfe9'},
},{dark:true}),darkHighlight]:[]}
watch(()=>props.dark,()=>{if(view)view.dispatch({effects:appearance.reconfigure(editorAppearance())})})
onMounted(()=>{
  view=new EditorView({parent:host.value,state:EditorState.create({doc:props.modelValue,extensions:[appearance.of(editorAppearance()),basicSetup,StreamLanguage.define(props.language==='xml'?xml:kotlin),EditorView.lineWrapping,EditorView.contentAttributes.of({'aria-label':props.language==='xml'?'Editor layout XML':'Editor kode Kotlin','spellcheck':'false'}),keymap.of([{key:'Tab',run:v=>{v.dispatch(v.state.replaceSelection('    '));return true}}]),EditorView.updateListener.of(update=>{if(update.docChanged)emit('update:modelValue',update.state.doc.toString());if(update.selectionSet){const pos=update.state.selection.main.head,line=update.state.doc.lineAt(pos);emit('cursor',{line:line.number,column:pos-line.from+1})}}),EditorView.theme({'&':{height:'100%',fontSize:'12px',background:'#fff'},'.cm-scroller':{fontFamily:'"SFMono-Regular", Consolas, "Liberation Mono", monospace',lineHeight:'1.85'},'.cm-content':{padding:'18px 0'},'.cm-gutters':{background:'#fff',border:'none',color:'#adb3c1',paddingRight:'8px'},'.cm-activeLine':{background:'#f7f5ff'},'.cm-activeLineGutter':{background:'transparent',color:'#7558ed'},'&.cm-focused':{outline:'none'},'.cm-selectionBackground':{background:'#e8e1ff !important'},'.cm-cursor':{borderLeftColor:'#7558ed'}})]})})
})
watch(()=>props.modelValue,value=>{if(view&&view.state.doc.toString()!==value)view.dispatch({changes:{from:0,to:view.state.doc.length,insert:value}})})
onBeforeUnmount(()=>view?.destroy())
</script>
<template><div class="code-editor" ref="host"></div></template>
