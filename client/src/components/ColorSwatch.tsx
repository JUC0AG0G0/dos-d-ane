interface ColorSwatchProps {
  /** Variable CSS du thème, ex. `--primary` (styles/global.css). */
  name: string;
  role: string;
}

/** Carré de couleur avec son nom de variable, sa valeur et son rôle. */
export function ColorSwatch({ name, role }: ColorSwatchProps) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return (
    <div className="flex items-center gap-3">
      <div
        className="size-12 shrink-0 rounded-md border"
        style={{ background: `var(${name})` }}
      />
      <div className="text-sm">
        <p className="font-mono font-medium">{name}</p>
        <p className="font-mono text-muted-foreground">{value}</p>
        <p className="text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
