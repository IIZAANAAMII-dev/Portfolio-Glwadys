import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '2px solid #592027',
        background: '#2b1d17',
        color: '#f3ede3',
        fontFamily: 'Georgia, serif',
        fontSize: 46,
        fontWeight: 400,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 12,
          top: -8,
          width: 1,
          height: 78,
          background: '#d0ad72',
          opacity: 0.7,
          transform: 'rotate(24deg)',
        }}
      />
      G
    </div>,
    size,
  );
}
