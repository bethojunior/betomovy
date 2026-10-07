import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CARD_HEIGHT, CARD_WIDTH, PIN_ANCHOR_OFFSET_Y, PIN_SIZE } from './constants';

const HIDDEN = -9999;
const ANIM = { duration: 150, easing: Easing.out(Easing.quad) };

type Variant = 'origin' | 'destination';
type Coordinate = { latitude: number; longitude: number };
type Point = { x: number; y: number };

export interface UseMarkerSyncParams {
  mapRef: React.RefObject<any>;
  coordinate: Coordinate | null | undefined;
  variant: Variant;
  conflictCoordinate?: Coordinate | null;
}

// ─── Helpers de posição ───────────────────────────────────────────────────────

function cardBounds(variant: Variant, px: number): [number, number] {
  return variant === 'destination'
    ? [px + PIN_SIZE / 2, px + PIN_SIZE / 2 + CARD_WIDTH]
    : [px - PIN_SIZE / 2 - CARD_WIDTH, px - PIN_SIZE / 2];
}

function xOverlap(a: [number, number], b: [number, number]): boolean {
  return a[0] < b[1] && a[1] > b[0];
}

function cardXForVariant(variant: Variant, px: number): number {
  return variant === 'destination'
    ? px + PIN_SIZE / 2
    : px - CARD_WIDTH - PIN_SIZE / 2;
}

function resolveScreenEdge(variant: Variant, px: number, screenWidth: number): Variant {
  if (variant === 'destination' && px + PIN_SIZE / 2 + CARD_WIDTH > screenWidth) return 'origin';
  if (variant === 'origin'      && px - PIN_SIZE / 2 - CARD_WIDTH < 0)           return 'destination';
  return variant;
}

// ─── Regra de colisão ─────────────────────────────────────────────────────────

function resolveCollision(params: {
  variant: Variant;
  side: Variant;
  point: Point;
  conflict: Point;
  screenWidth: number;
}): { side: Variant; below: boolean } {
  const { variant, side, point, conflict, screenWidth } = params;

  // Apenas destination se ajusta; origin fica no alinhamento padrão
  if (variant !== 'destination') return { side, below: false };

  const yClose = Math.abs(point.y - conflict.y) < CARD_HEIGHT;
  if (!yClose) return { side, below: false };

  const conflictSide = resolveScreenEdge('origin', conflict.x, screenWidth);
  const collides = xOverlap(cardBounds(side, point.x), cardBounds(conflictSide, conflict.x));

  return { side, below: collides };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMarkerSync({
  mapRef,
  coordinate,
  variant,
  conflictCoordinate,
}: UseMarkerSyncParams) {
  const cardTx = useSharedValue(HIDDEN);
  const cardTy = useSharedValue(HIDDEN);
  const [pinPos, setPinPos] = useState<Point | null>(null);

  const cardHeightRef = useRef(0);
  const coordinateRef = useRef(coordinate);
  const conflictRef = useRef(conflictCoordinate);
  const initialized = useRef(false);
  const posStateRef = useRef('');

  coordinateRef.current = coordinate;
  conflictRef.current = conflictCoordinate;

  const sync = useCallback(async () => {
    if (!mapRef.current || !coordinateRef.current) return;
    try {
      const [point, conflictPoint] = await Promise.all([
        mapRef.current.pointForCoordinate(coordinateRef.current),
        conflictRef.current
          ? mapRef.current.pointForCoordinate(conflictRef.current)
          : Promise.resolve(null),
      ]);

      const { width: screenWidth } = Dimensions.get('window');
      const side = resolveScreenEdge(variant, point.x, screenWidth);

      const { below } = conflictPoint
        ? resolveCollision({ variant, side, point, conflict: { x: conflictPoint.x, y: conflictPoint.y }, screenWidth })
        : { below: false };

      const cardX = cardXForVariant(side, point.x);
      const cardY = below
        ? point.y + PIN_SIZE / 2
        : point.y - PIN_ANCHOR_OFFSET_Y(cardHeightRef.current);

      setPinPos({ x: point.x - PIN_SIZE / 2, y: point.y - PIN_SIZE / 2 });

      const posState = `${side}-${below}`;
      const didChange = initialized.current && posState !== posStateRef.current;
      posStateRef.current = posState;

      if (!initialized.current) {
        cardTx.value = cardX;
        cardTy.value = cardY;
        initialized.current = true;
      } else if (didChange) {
        cardTx.value = withTiming(cardX, ANIM);
        cardTy.value = withTiming(cardY, ANIM);
      } else {
        cardTx.value = cardX;
        cardTy.value = cardY;
      }
    } catch {
      // map not ready yet
    }
  }, [mapRef, cardTx, cardTy, variant]);

  useEffect(() => {
    sync();
  }, [coordinate, sync]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: cardTx.value },
      { translateY: cardTy.value },
    ] as any,
  }));

  const onCardLayout = useCallback(
    (e: any) => {
      cardHeightRef.current = e.nativeEvent.layout.height;
      sync();
    },
    [sync],
  );

  return { sync, cardAnimatedStyle, pinPos, onCardLayout };
}
