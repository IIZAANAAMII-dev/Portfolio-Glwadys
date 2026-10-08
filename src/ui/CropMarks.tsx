interface Props {
  className?: string;
}

/** Registration strokes stay attached to the print, including during a Flip. */
export function CropMarks({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" aria-hidden="true">
      {[
        'M 4 18 V 4 H 18',
        'M 82 4 H 96 V 18',
        'M 96 82 V 96 H 82',
        'M 18 96 H 4 V 82',
      ].map((d) => (
        <path key={d} d={d} pathLength="1" stroke="currentColor" data-crop-stroke />
      ))}
    </svg>
  );
}
