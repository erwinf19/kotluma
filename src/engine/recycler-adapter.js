// A deliberately bounded teaching adapter. Only padding/textSize are editable here;
// custom binding, ViewHolders and arbitrary adapter code need Android Studio.
export function textListAdapterSource(padding = 16, textSize = 16) {
  return `class TextListAdapter(private val items: List<String>) : RecyclerView.Adapter<TextListAdapter.Holder>() {
    class Holder(val label: TextView) : RecyclerView.ViewHolder(label)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): Holder {
        val density = parent.resources.displayMetrics.density
        val inset = (${padding} * density).toInt()
        val label = TextView(parent.context)
        label.layoutParams = RecyclerView.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
        label.setPadding(inset, inset, inset, inset)
        label.textSize = ${textSize}f
        return Holder(label)
    }

    override fun onBindViewHolder(holder: Holder, position: Int) {
        holder.label.text = items[position]
    }

    override fun getItemCount(): Int = items.size
}`
}
export function parseTextListAdapter(source) {
  const clean = source.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '')
  const padding = Number(clean.match(/val\s+inset\s*=\s*\(\s*(\d+)\s*\*\s*density/)?.[1])
  const textSize = Number(clean.match(/label\.textSize\s*=\s*(\d+)f/)?.[1])
  const normalize = value => value.replace(/\s/g, '')
  if (!Number.isFinite(padding) || padding > 64 || !Number.isFinite(textSize) || textSize < 8 || textSize > 48 || normalize(clean) !== normalize(textListAdapterSource(padding, textSize))) {
    throw Error('TextListAdapter mendukung template contoh dengan inset 0–64 dan textSize 8–48f. Adapter/binding kustom belum diinterpretasi; pulihkan contoh atau gunakan Android Studio.')
  }
  return { padding, textSize }
}
