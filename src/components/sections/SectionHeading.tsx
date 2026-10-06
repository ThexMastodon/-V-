export function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <header>
      {eyebrow && <p className="text-action text-sm font-medium tracking-[0.2em] uppercase">{eyebrow}</p>}
      <h2 className="font-display mt-3 text-[clamp(2rem,4.5vw,3.5rem)] leading-tight font-semibold tracking-tight">
        {title}
      </h2>
    </header>
  )
}
