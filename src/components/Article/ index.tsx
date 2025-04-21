"use client";

import React, { useEffect } from "react";
import Modal from "react-modal";
import styles from "./Article.module.scss";
import { useImageLightbox } from "@/hooks/useImageLightbox";
import Lightbox from "@/components/Lightbox";

type Props = {
  html: string;
};

const Article: React.FC<Props> = ({ html }) => {
  const { containerRef, isOpen, imageSrc, closeLightbox, goToNext, goToPrev } =
    useImageLightbox();

  useEffect(() => {
    const appElement = document.getElementById("__next");
    if (appElement) {
      Modal.setAppElement(appElement);
    }
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className={styles.htmlContainer}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Lightbox
        isOpen={isOpen}
        imageSrc={imageSrc}
        closeLightbox={closeLightbox}
        goToNext={goToNext}
        goToPrev={goToPrev}
      />
    </>
  );
};

export default Article;
