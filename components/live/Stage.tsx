import Lane from "./Lane"

export default function Stage() {
  const cards = []

  return (
    <div className="grid grid-cols-5 justify-items-stretch min-w-max divide-x divide-solid divide-slate-500/25">
      {
        cardIds.map(id => <Lane cardId={id} key={id} />)
      }
    </div>
  )
}