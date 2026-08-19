import { MediaSlot as MediaSlotData, aspectRatioToPadding, colorMap } from '@/lib/media';
import { cn } from '@/lib/utils';

export interface MediaSlotProps {
  slot: MediaSlotData;
  className?: string;
  textClassName?: string;
}

export function MediaSlot({ slot, className, textClassName }: MediaSlotProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        colorMap[slot.color],
        'will-change-transform',
        className,
      )}
      style={{ aspectRatio: slot.aspect.replace(':', '/') }}
      data-media-id={slot.id}
      data-aspect={slot.aspect}
      data-role={slot.role}
    >
      {slot.src ? (
        <img
          src={slot.src}
          alt={slot.alt || slot.label}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <span
        className={cn(
          'pointer-events-none absolute bottom-2 left-2 z-10',
          'font-mono text-[9px] uppercase tracking-widest',
          slot.color === 'ivory' || slot.color === 'champagne'
            ? 'text-obsidian/50'
            : 'text-ivory/40',
          textClassName,
        )}
      >
        {slot.label}
      </span>
    </div>
  );
}
