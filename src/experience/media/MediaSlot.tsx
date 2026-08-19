import Image from 'next/image';
import { getSlot } from './slots';

type Props = {
  /** Slot id from slots.ts. */
  slot: string;
  /** Override the manifest ratio — used by crop transitions. */
  ratio?: string;
  className?: string;
  /** Focal point for the crop, e.g. '50% 30%'. */
  objectPosition?: string;
  /** Above-the-fold slots only. */
  priority?: boolean;
  sizes?: string;
};

/**
 * A media position in the experience.
 *
 * Renders the real photograph when the slot has a `src`, and a designed
 * editorial plate when it does not. Both render at exactly the same size and
 * aspect ratio, so swapping in real media never shifts layout or requires an
 * animation change.
 */
export function MediaSlot({
  slot: slotId,
  ratio,
  className,
  objectPosition = '50% 50%',
  priority = false,
  sizes = '(max-width: 767px) 100vw, 50vw',
}: Props) {
  const slot = getSlot(slotId);
  const style = { aspectRatio: ratio ?? slot.ratio } as const;

  if (slot.src) {
    return (
      <figure
        className={['media', className].filter(Boolean).join(' ')}
        style={style}
        data-slot={slot.id}
        data-temporary={slot.temporary ? 'true' : undefined}
      >
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          priority={priority}
          sizes={sizes}
          style={{ objectFit: 'cover', objectPosition }}
        />
      </figure>
    );
  }

  return <EditorialPlate slot={slot} style={style} className={className} />;
}

/**
 * The placeholder. Deliberately designed: correct ratio, project palette,
 * crop marks, slot id, the art-direction note and the motion role. It should
 * read as a page from an art-direction board, so that an empty portfolio still
 * communicates intent rather than absence.
 */
function EditorialPlate({
  slot,
  style,
  className,
}: {
  slot: ReturnType<typeof getSlot>;
  style: { aspectRatio: string };
  className?: string;
}) {
  return (
    <figure
      className={['media', 'plate', className].filter(Boolean).join(' ')}
      style={style}
      data-slot={slot.id}
      data-chapter={slot.chapter}
      aria-label={slot.alt}
      role="img"
    >
      <span className="plate__mark plate__mark--tl" aria-hidden />
      <span className="plate__mark plate__mark--tr" aria-hidden />
      <span className="plate__mark plate__mark--bl" aria-hidden />
      <span className="plate__mark plate__mark--br" aria-hidden />

      <header className="plate__head">
        <span className="plate__id">{slot.id}</span>
        <span className="plate__ratio">{slot.ratio.replace(/\s/g, '')}</span>
      </header>

      <p className="plate__note">{slot.note}</p>

      <footer className="plate__foot">
        <span className="plate__role">{slot.role}</span>
      </footer>
    </figure>
  );
}
