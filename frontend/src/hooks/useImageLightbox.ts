import { useEffect, useState, useRef, useCallback } from "react";

export const useImageLightbox = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);

  const openLightbox = (src: string) => {
    setImageSrc(src);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setImageSrc(null);
  };

  const handleImageClick = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLImageElement;
    openLightbox(target.src);
  }, []);

  const attachClickHandlers = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const images = container.querySelectorAll("img");
    const newSrcs: string[] = [];

    images.forEach((img) => {
      newSrcs.push(img.src);
      img.style.cursor = "zoom-in";
      img.removeEventListener("click", handleImageClick);
      img.addEventListener("click", handleImageClick);
    });

    // сравниваем с текущим списком, чтобы не вызывать setImageList лишний раз
    if (
      newSrcs.length !== imageList.length ||
      !newSrcs.every((src, i) => src === imageList[i])
    ) {
      setImageList(newSrcs);
    }
  }, [handleImageClick, imageList]);

  useEffect(() => {
    attachClickHandlers();

    const observer = new MutationObserver(() => {
      attachClickHandlers();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, [attachClickHandlers]);

  const goToNext = () => {
    if (!imageSrc || imageList.length === 0) return;
    const index = imageList.indexOf(imageSrc);
    const nextIndex = (index + 1) % imageList.length;
    setImageSrc(imageList[nextIndex]);
  };

  const goToPrev = () => {
    if (!imageSrc || imageList.length === 0) return;
    const index = imageList.indexOf(imageSrc);
    const prevIndex = (index - 1 + imageList.length) % imageList.length;
    setImageSrc(imageList[prevIndex]);
  };

  return {
    containerRef,
    isOpen,
    imageSrc,
    closeLightbox,
    goToNext,
    goToPrev,
  };
};
