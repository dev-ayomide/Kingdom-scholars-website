export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border-2 border-navy/15 border-t-wine rounded-full animate-spin" />
        <p className="text-navy/35 text-xs font-semibold tracking-[0.2em] uppercase">Loading</p>
      </div>
    </div>
  )
}
