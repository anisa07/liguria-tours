import React, { useState, useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Locale } from "@/i18n/config";

export interface CarouselItem {
  id: string;
  content: ReactNode;
  alt?: string;
}

export interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  itemsPerView?: number;
  gap?: number;
  className?: string;
  locale?: Locale;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  interval = 3000,
  showDots = true,
  showArrows = true,
  loop = true,
  itemsPerView = 1,
  gap = 16,
  className = "",
  locale = "en",
}) => {
  const { t } = useTranslation(locale, ["common"]);

  // Safe translation function
  const safeT = (
    key: string,
    fallback: string,
    params?: Record<string, string | number>
  ) => {
    return t ? t(key, fallback, params) : fallback;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const intervalRef = useRef<number | undefined>(undefined);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalSlides = items.length;
  const maxIndex = Math.max(0, totalSlides - itemsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && totalSlides > itemsPerView) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex((prev) => {
          if (loop) {
            return prev >= maxIndex ? 0 : prev + 1;
          }
          return prev >= maxIndex ? prev : prev + 1;
        });
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, interval, totalSlides, itemsPerView, maxIndex, loop]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        goToPrevious();
        break;
      case "ArrowRight":
        event.preventDefault();
        goToNext();
        break;
      case " ":
        event.preventDefault();
        togglePlayPause();
        break;
    }
  };

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => {
      if (loop) {
        return prev >= maxIndex ? 0 : prev + 1;
      }
      return Math.min(prev + 1, maxIndex);
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      if (loop) {
        return prev <= 0 ? maxIndex : prev - 1;
      }
      return Math.max(prev - 1, 0);
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Calculate transform offset
  const getTransformOffset = () => {
    const slideWidth = 100 / itemsPerView;
    return `translateX(-${currentIndex * slideWidth}%)`;
  };

  if (totalSlides === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
        <p className="text-muted-foreground">
          {safeT("carousel.noItems", "No items to display")}
        </p>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
    <div
      ref={carouselRef}
      className={`relative overflow-hidden rounded-lg bg-background ${className}`}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      role="region"
      aria-label={safeT("carousel.label", "Image carousel")}
      aria-roledescription="carousel"
    >
      {/* Main carousel container */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: getTransformOffset(),
              gap: `${gap}px`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0"
                style={{ width: `${100 / itemsPerView}%` }}
                role="group"
                aria-roledescription="slide"
                aria-label={
                  item.alt ||
                  safeT(
                    "carousel.slideLabel",
                    "Slide {{number}} of {{total}}",
                    { number: index + 1, total: totalSlides }
                  )
                }
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {showArrows && totalSlides > itemsPerView && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/80 hover:bg-background border border-border rounded-full shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={goToPrevious}
              disabled={!loop && currentIndex === 0}
              aria-label={safeT("carousel.previous", "Previous slide")}
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/80 hover:bg-background border border-border rounded-full shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={goToNext}
              disabled={!loop && currentIndex >= maxIndex}
              aria-label={safeT("carousel.next", "Next slide")}
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Dots indicator */}
      {showDots && totalSlides > itemsPerView && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground hover:bg-muted-foreground/80"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={safeT(
                "carousel.goToSlide",
                "Go to slide {{number}}",
                { number: index + 1 }
              )}
            />
          ))}
        </div>
      )}

      {/* Play/Pause controls */}
      {autoPlay && (
        <div className="absolute bottom-4 right-4">
          <button
            type="button"
            className="p-2 bg-background/80 hover:bg-background border border-border rounded-full shadow-md transition-all duration-200"
            onClick={togglePlayPause}
            aria-label={
              isPlaying
                ? safeT("carousel.pause", "Pause carousel")
                : safeT("carousel.play", "Play carousel")
            }
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-foreground" />
            ) : (
              <Play className="w-4 h-4 text-foreground" />
            )}
          </button>
        </div>
      )}

      {/* Screen reader live region for announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {safeT("carousel.currentSlide", "Slide {{current}} of {{total}}", {
          current: currentIndex + 1,
          total: Math.ceil(totalSlides / itemsPerView),
        })}
      </div>
    </div>
  );
};

export default Carousel;
