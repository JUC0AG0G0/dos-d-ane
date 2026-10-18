import { Input } from '@/components/ui/input';
import { Field } from './Field';

/** Source : libellé + lien https://, à remplir ensemble ou pas du tout. */
export function SourceFields({
  label,
  url,
  onChange,
}: {
  label: string;
  url: string;
  onChange: (source: { label: string; url: string }) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Source · libellé" htmlFor="source-label">
        <Input
          id="source-label"
          value={label}
          placeholder="INRS · Le travail sur écran"
          onChange={(event) => onChange({ label: event.target.value, url })}
        />
      </Field>
      <Field
        label="Source · lien"
        htmlFor="source-url"
        hint="Ouvert dans un nouvel onglet."
      >
        <Input
          id="source-url"
          type="url"
          value={url}
          placeholder="https://"
          onChange={(event) => onChange({ label, url: event.target.value })}
        />
      </Field>
    </div>
  );
}
