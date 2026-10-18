import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberMarker } from './NumberMarker';
import { localId, move, type EditableItem } from '@/utils/list';
import { SortableItem, SortableList } from './Sortable';

/**
 * Liste de textes réordonnable (étapes d'un exercice, conseils d'une zone) :
 * glisser-déposer, ajout, suppression. Les lignes vides sont ignorées à
 * l'enregistrement.
 */
export function EditableList({
  items,
  onChange,
  addLabel,
  placeholder,
  numbered,
}: {
  items: EditableItem[];
  onChange: (items: EditableItem[]) => void;
  addLabel: string;
  placeholder?: string;
  numbered?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <SortableList
        ids={items.map(({ id }) => id)}
        onMove={(from, to) => onChange(move(items, from, to))}
      >
        {items.map((item, index) => (
          <EditableRow
            key={item.id}
            item={item}
            index={numbered ? index + 1 : undefined}
            placeholder={placeholder}
            onText={(text) =>
              onChange(
                items.map((i) => (i.id === item.id ? { ...i, text } : i)),
              )
            }
            onRemove={() => onChange(items.filter((i) => i.id !== item.id))}
          />
        ))}
      </SortableList>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="justify-self-start"
        onClick={() => onChange([...items, { id: localId(), text: '' }])}
      >
        <Plus />
        {addLabel}
      </Button>
    </div>
  );
}

function EditableRow({
  item,
  index,
  placeholder,
  onText,
  onRemove,
}: {
  item: EditableItem;
  index?: number;
  placeholder?: string;
  onText: (text: string) => void;
  onRemove: () => void;
}) {
  return (
    <SortableItem id={item.id} className="flex items-center gap-2 rounded-md">
      {(handle) => (
        <>
          {handle}
          {index !== undefined && (
            <NumberMarker value={index} className="size-5" />
          )}
          <Input
            value={item.text}
            placeholder={placeholder}
            onChange={(event) => onText(event.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label="Retirer"
          >
            <X />
          </Button>
        </>
      )}
    </SortableItem>
  );
}
