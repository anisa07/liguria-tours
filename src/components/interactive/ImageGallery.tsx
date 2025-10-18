import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Locale } from "@/i18n/config";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: number;
  gap?: number;
  showThumbnails?: boolean;
  showCaption?: boolean;
  showFullscreen?: boolean;
  lazy?: boolean;
  aspectRatio?: "square" | "landscape" | "portrait" | "auto";
  className?: string;
  imageClassName?: string;
  thumbnailClassName?: string;
  onImageClick?: (image: GalleryImage, index: number) => void;
  locale?: Locale;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  gap = 16,
  showThumbnails = true,
  showCaption = true,
  showFullscreen = true,
  lazy = true,
  aspectRatio = "auto",
  className = "",
  imageClassName = "",
  thumbnailClassName = "",
  onImageClick,
  locale = "en",
}) => {
  const { t } = useTranslation(locale, ["common"]);

  // Safe translation function
  const safeT = (key: string, fallback: string) => {
    return t ? t(key, fallback) : fallback;
  };
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set<number>());

  const galleryRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Handle image selection
  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(index);
    onImageClick?.(image, index);

    if (showFullscreen) {
      setIsFullscreen(true);
    }
  };

  // Navigation in fullscreen
  const navigateFullscreen = useCallback(
    (direction: "prev" | "next") => {
      if (selectedImage === null) return;

      let newIndex;
      if (direction === "prev") {
        newIndex = selectedImage > 0 ? selectedImage - 1 : images.length - 1;
      } else {
        newIndex = selectedImage < images.length - 1 ? selectedImage + 1 : 0;
      }

      setSelectedImage(newIndex);
    },
    [selectedImage, images.length]
  );

  // Close fullscreen
  const closeFullscreen = () => {
    setIsFullscreen(false);
    setSelectedImage(null);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (event.key) {
        case "Escape":
          closeFullscreen();
          break;
        case "ArrowLeft":
          event.preventDefault();
          navigateFullscreen("prev");
          break;
        case "ArrowRight":
          event.preventDefault();
          navigateFullscreen("next");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, selectedImage, navigateFullscreen]);

  // Handle lazy loading
  useEffect(() => {
    if (!lazy) {
      setLoadedImages(new Set(images.map((_, index) => index)));
      return;
    }

    const observer = new globalThis.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            setLoadedImages((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const imageElements = galleryRef.current?.querySelectorAll("[data-index]");
    imageElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [lazy, images]);

  // Get aspect ratio classes
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "landscape":
        return "aspect-video";
      case "portrait":
        return "aspect-[3/4]";
      default:
        return "";
    }
  };

  // Get grid classes
  const getGridClasses = () => {
    const colsMap = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    };

    return colsMap[columns as keyof typeof colsMap] || "grid-cols-3";
  };

  return (
    <>
      {/* Main Gallery */}
      <div
        ref={galleryRef}
        className={`grid ${getGridClasses()} ${className}`}
        style={{ gap: `${gap}px` }}
        role="grid"
        aria-label={safeT("gallery.label", "Image gallery")}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`
              group relative overflow-hidden rounded-lg bg-muted cursor-pointer
              transform transition-all duration-200 hover:scale-105 hover:shadow-lg
              focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
              ${getAspectRatioClasses()}
            `}
            data-index={index}
            role="gridcell"
          >
            {/* Image */}
            {loadedImages.has(index) || !lazy ? (
              <button
                type="button"
                className="w-full h-full p-0 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                onClick={() => handleImageClick(image, index)}
                aria-label={safeT(
                  "gallery.viewFullscreen",
                  `View ${image.title || image.alt} in fullscreen`
                )}
              >
                <img
                  src={image.thumbnail || image.src}
                  alt={image.alt}
                  className={`
                    w-full h-full object-cover transition-opacity duration-300
                    group-hover:opacity-90
                    ${imageClassName}
                  `}
                />
              </button>
            ) : (
              <div className="w-full h-full bg-muted animate-pulse" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-overlay/0 group-hover:bg-overlay/20 transition-all duration-200" />

            {/* Zoom Icon */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-background/80 rounded-full p-2">
                <ZoomIn className="w-4 h-4 text-foreground" />
              </div>
            </div>

            {/* Caption */}
            {showCaption && (image.title || image.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent p-4 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {image.title && (
                  <h3 className="text-sm font-medium truncate">
                    {image.title}
                  </h3>
                )}
                {image.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {image.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && selectedImage !== null && (
        <div
          ref={fullscreenRef}
          className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center cursor-pointer"
          onClick={(e: React.MouseEvent) => {
            if (e.target === fullscreenRef.current) {
              closeFullscreen();
            }
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Escape") {
              closeFullscreen();
            }
          }}
          role="button"
          aria-label="Close fullscreen view by clicking backdrop"
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 z-60 text-primary-foreground hover:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-2"
            onClick={closeFullscreen}
            aria-label={safeT(
              "gallery.closeFullscreen",
              "Close fullscreen view"
            )}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-60 text-primary-foreground hover:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-2"
                onClick={() => navigateFullscreen("prev")}
                aria-label={safeT("gallery.previousImage", "Previous image")}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-60 text-primary-foreground hover:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-2"
                onClick={() => navigateFullscreen("next")}
                aria-label={safeT("gallery.nextImage", "Next image")}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Main Image */}
          {selectedImage !== null && (
            <div className="max-w-full max-h-full p-8">
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="max-w-full max-h-full object-contain"
              />

              {/* Fullscreen Caption */}
              {showCaption &&
                (images[selectedImage].title ||
                  images[selectedImage].description) && (
                  <div className="mt-4 text-center text-primary-foreground">
                    <h2 id="fullscreen-title" className="text-xl font-medium">
                      {images[selectedImage].title}
                    </h2>
                    {images[selectedImage].description && (
                      <p className="text-muted-foreground mt-2">
                        {images[selectedImage].description}
                      </p>
                    )}
                  </div>
                )}
            </div>
          )}

          {/* Thumbnails Navigation */}
          {showThumbnails && images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  className={`
                    flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200
                    ${index === selectedImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}
                    ${thumbnailClassName}
                  `}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View ${image.title || image.alt}`}
                >
                  <img
                    src={image.thumbnail || image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Image Counter */}
          {selectedImage !== null && (
            <div className="absolute top-4 left-4 text-foreground text-sm bg-background/80 border border-border px-3 py-1 rounded-md">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGallery;
