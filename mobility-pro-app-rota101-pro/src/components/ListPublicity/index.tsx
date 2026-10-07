import { useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Publicity } from '~/interfaces/publicity';
import CardPublicity from '~/components/CardPublicity';
import PaginationDots, { PaginationDotsHandle } from '~/components/PaginationDots';
import { Container, ListItem, PaginationOverlay } from './styles';

const DEFAULT_AUTO_SCROLL_INTERVAL = 6000;
const DEFAULT_SPACING = RFValue(10);

interface Props {
  data: Publicity[];
  spacing?: number;
  itemWidth?: number;
  showPagination?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
}

export default function ListPublicity({
  data,
  spacing = DEFAULT_SPACING,
  itemWidth,
  showPagination = true,
  paddingTop,
  paddingBottom,
}: Props) {
  const [containerWidth, setContainerWidth] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const dotsRef = useRef<PaginationDotsHandle>(null);
  const currentIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cardWidth = itemWidth ?? Math.max(containerWidth - spacing * 2, 0);
  const sideInset = Math.max((containerWidth - cardWidth) / 2, 0);
  const pageSize = cardWidth + spacing;

  useEffect(() => {
    currentIndexRef.current = 0;
    dotsRef.current?.setActiveIndex(0);
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [data]);

  function getCurrentAutoScrollInterval() {
    const amountOfTime = data[currentIndexRef.current]?.amountOfTime;
    return amountOfTime != null ? amountOfTime * 1000 : DEFAULT_AUTO_SCROLL_INTERVAL;
  }

  function scheduleAutoScroll() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!pageSize || data.length <= 1) return;

    timerRef.current = setTimeout(() => {
      const nextIndex = (currentIndexRef.current + 1) % data.length;
      currentIndexRef.current = nextIndex;
      dotsRef.current?.setActiveIndex(nextIndex);

      scrollRef.current?.scrollTo({
        x: nextIndex * pageSize,
        animated: true,
      });

      scheduleAutoScroll();
    }, getCurrentAutoScrollInterval());
  }

  useEffect(() => {
    scheduleAutoScroll();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, pageSize]);

  function handleLayout(event: LayoutChangeEvent) {
    setContainerWidth(event.nativeEvent.layout.width);
  }

  function handleScrollBeginDrag() {
    scheduleAutoScroll();
  }

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!pageSize) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / pageSize);
    currentIndexRef.current = index;
    dotsRef.current?.setActiveIndex(index);
    scheduleAutoScroll();
  }

  if (data.length === 0) return null;

  return (
    <Container onLayout={handleLayout}>
      {containerWidth > 0 && (
        <ScrollView
          ref={scrollRef}
          horizontal
          decelerationRate="fast"
          disableIntervalMomentum
          snapToInterval={pageSize}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScrollBeginDrag={handleScrollBeginDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={{
            paddingHorizontal: sideInset,
            gap: spacing,
            paddingBottom,
            paddingTop,
          }}
        >
          {data.map((publicity, index) => (
            <ListItem key={publicity?.id ?? index} width={cardWidth}>
              <CardPublicity publicity={publicity} />
            </ListItem>
          ))}
        </ScrollView>
      )}

      {showPagination && (
        <PaginationOverlay style={{ paddingBottom }}>
          <PaginationDots ref={dotsRef} total={data.length} />
        </PaginationOverlay>
      )}
    </Container>
  );
}
