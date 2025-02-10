import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface CarouselProps {
  children: React.ReactNode;
  onSlideChange: (index: number) => void;
  currentSlide?: number;
}

export function Carousel({ children, onSlideChange, currentSlide }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'start',
    skipSnaps: false
  });

  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        onSlideChange(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi, onSlideChange]);

  // Sync carousel with external currentSlide changes
  React.useEffect(() => {
    if (emblaApi && typeof currentSlide === 'number') {
      emblaApi.scrollTo(currentSlide);
    }
  }, [emblaApi, currentSlide]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {React.Children.map(children, (child) => (
          <div className="flex-[0_0_100%] min-w-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}