import { useEffect, useMemo, useState } from 'react';
import { PetId } from '../store/useFocusStore';

export type PetMood = 'idle' | 'focus' | 'pause' | 'warning';

export function PetAvatar({ petId, mood, size = 96 }: { petId: PetId; mood: PetMood; size?: number }) {
  const outline = '#2b1d14';
  const moodIsWarning = mood === 'warning';
  const moodIsPause = mood === 'pause';

  const sources = useMemo(
    () => [`/pets/${petId}.png`, `/pets/${petId}.jpg`, `/pets/${petId}.jpeg`, `/pets/${petId}.webp`],
    [petId],
  );
  const [sourceIndex, setSourceIndex] = useState(0);
  const [useFallbackSvg, setUseFallbackSvg] = useState(false);

  useEffect(() => {
    setSourceIndex(0);
    setUseFallbackSvg(false);
  }, [petId]);

  const imgClass = moodIsWarning
    ? 'pet-img pet-img-warning'
    : moodIsPause
      ? 'pet-img pet-img-pause'
      : 'pet-img pet-img-idle';

  if (!useFallbackSvg) {
    return (
      <div style={{ width: size, height: size }} className="select-none flex items-center justify-center relative overflow-hidden">
        <img
          src={sources[sourceIndex]}
          alt=""
          draggable={false}
          className={`${imgClass} object-contain`}
          style={{ width: size, height: size, color: 'transparent' }}
          onError={() => {
            if (sourceIndex < sources.length - 1) {
              setSourceIndex((i) => i + 1);
              return;
            }
            setUseFallbackSvg(true);
          }}
        />
      </div>
    );
  }

  const palette =
    petId === 'cat'
      ? { a: '#f6d6c9', b: '#f2b8a2', c: '#ffffff' }
      : petId === 'dog'
        ? { a: '#f0b36a', b: '#e58f3a', c: '#fff3d8' }
        : petId === 'bird'
          ? { a: '#b7e4c7', b: '#74c69d', c: '#ffffff' }
          : petId === 'turtle'
            ? { a: '#a3d9a5', b: '#5aa469', c: '#2f6f5e' }
            : { a: '#f6b48f', b: '#e07a5f', c: '#fff3e8' };

  const mouth = moodIsWarning ? 'M10.2 16.6c1.1-1 2.5-1 3.6 0' : 'M10.2 16c1 1 2.6 1 3.6 0';

  return (
    <div style={{ width: size, height: size }} className={`select-none pet-breathe ${moodIsWarning ? 'pet-warning' : ''}`}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="21" rx="6.8" ry="1.2" fill="rgba(0,0,0,0.10)" />

        <g className="pet-tail">
          {petId === 'cat' && <path d="M18.3 15.7c2 .6 2.5 2.1 1.1 3.2" stroke={outline} strokeWidth="1.6" strokeLinecap="round" />}
          {petId === 'dog' && <path d="M18.2 15.8c2.3 1 2.2 2.9.2 3.4" stroke={outline} strokeWidth="1.6" strokeLinecap="round" />}
          {petId === 'bird' && <path d="M18.4 16c1.7.1 2.6 1 2.1 2.1" stroke={outline} strokeWidth="1.5" strokeLinecap="round" />}
          {petId === 'turtle' && <path d="M18.1 16.1c1.5.1 2.2.9 1.6 1.9" stroke={outline} strokeWidth="1.5" strokeLinecap="round" />}
          {petId === 'fox' && <path d="M18.4 15.6c2 .3 2.9 1.9 1.1 3.2" stroke={outline} strokeWidth="1.6" strokeLinecap="round" />}
        </g>

        <g>
          <path
            d="M7.3 13.6c0-2.7 2.1-4.9 4.7-4.9s4.7 2.2 4.7 4.9c0 3.1-2.1 5.6-4.7 5.6s-4.7-2.5-4.7-5.6Z"
            fill={palette.c}
            stroke={outline}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {(petId === 'dog' || petId === 'fox') && (
            <path
              d="M8.6 14.2c0-1.8 1.5-3.2 3.4-3.2s3.4 1.4 3.4 3.2c0 2-1.5 3.6-3.4 3.6s-3.4-1.6-3.4-3.6Z"
              fill={palette.c}
              stroke={outline}
              strokeWidth="1.2"
              strokeLinejoin="round"
              opacity="0.95"
            />
          )}

          {petId === 'turtle' && (
            <path
              d="M8.4 13.8c0-2.1 1.6-3.8 3.6-3.8s3.6 1.7 3.6 3.8c0 2.4-1.7 4.3-3.6 4.3s-3.6-1.9-3.6-4.3Z"
              fill={palette.c}
              stroke={outline}
              strokeWidth="1.2"
              opacity="0.9"
            />
          )}
        </g>

        <g className="pet-head">
          <path
            d="M6.8 12c0-3.1 2.3-5.7 5.2-5.7S17.2 8.9 17.2 12c0 2.9-2.1 5.2-5.2 5.2S6.8 14.9 6.8 12Z"
            fill={palette.a}
            stroke={outline}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          <g className="pet-ear-left">
            {petId === 'cat' && <path d="M8.4 7.3 7 4.9c-.3-.6.3-1.2.9-.9l2.2 1.2" fill={palette.b} stroke={outline} strokeWidth="1.4" strokeLinejoin="round" />}
            {petId === 'dog' && <path d="M8.3 8.1 6.3 6.2c-.7-.7.1-1.7 1-1.4l2.4.8" fill={palette.b} stroke={outline} strokeWidth="1.4" strokeLinejoin="round" />}
            {petId === 'bird' && <path d="M8.4 8 7.2 6.7c-.5-.6.1-1.4.8-1.1l1.7.6" fill={palette.b} stroke={outline} strokeWidth="1.3" strokeLinejoin="round" />}
            {petId === 'turtle' && <path d="M8.3 8.2 7.4 7.1c-.4-.6.2-1.3.8-1l1.3.6" fill={palette.b} stroke={outline} strokeWidth="1.3" strokeLinejoin="round" />}
            {petId === 'fox' && <path d="M8.4 7.4 6.8 5.2c-.4-.6.3-1.4 1-1.1l2.1.9" fill={palette.b} stroke={outline} strokeWidth="1.4" strokeLinejoin="round" />}
          </g>

          <g className="pet-ear-right">
            {petId === 'cat' && <path d="M15.6 7.3 17 4.9c.3-.6-.3-1.2-.9-.9l-2.2 1.2" fill={palette.b} stroke={outline} strokeWidth="1.4" strokeLinejoin="round" />}
            {petId === 'dog' && <path d="M15.7 8.1 17.7 6.2c.7-.7-.1-1.7-1-1.4l-2.4.8" fill={palette.b} stroke={outline} strokeWidth="1.4" strokeLinejoin="round" />}
            {petId === 'bird' && <path d="M15.6 8 16.8 6.7c.5-.6-.1-1.4-.8-1.1l-1.7.6" fill={palette.b} stroke={outline} strokeWidth="1.3" strokeLinejoin="round" />}
            {petId === 'turtle' && <path d="M15.7 8.2 16.6 7.1c.4-.6-.2-1.3-.8-1l-1.3.6" fill={palette.b} stroke={outline} strokeWidth="1.3" strokeLinejoin="round" />}
            {petId === 'fox' && <path d="M15.6 7.4 17.2 5.2c.4-.6-.3-1.4-1-1.1l-2.1.9" fill={palette.b} stroke={outline} strokeWidth="1.4" strokeLinejoin="round" />}
          </g>

          {moodIsPause ? (
            <>
              <path d="M8.9 13.1c.7.6 1.4.6 2.1 0" stroke={outline} strokeWidth="1.1" strokeLinecap="round" />
              <path d="M13 13.1c.7.6 1.4.6 2.1 0" stroke={outline} strokeWidth="1.1" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="9.6" cy="13.2" r="0.7" fill={outline} />
              <circle cx="14.4" cy="13.2" r="0.7" fill={outline} />
            </>
          )}

          {petId === 'bird' ? (
            <path d="M11.4 14.7 12 15.3l.6-.6" stroke="#f1c40f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M12 14.7c0 .1 0 .1 0 0" stroke={outline} strokeWidth="1.8" strokeLinecap="round" />
          )}

          <path d={mouth} stroke={outline} strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="9.4" cy="15.5" r="0.8" fill="#f2c9b3" opacity={moodIsWarning ? 0.9 : 0.55} />
          <circle cx="14.6" cy="15.5" r="0.8" fill="#f2c9b3" opacity={moodIsWarning ? 0.9 : 0.55} />
          {petId === 'dog' && (
            <path d="M12 15.1c.2.3.7.5 1.1.2" stroke="#e37b8a" strokeWidth="1.2" strokeLinecap="round" />
          )}
        </g>
      </svg>
    </div>
  );
}
