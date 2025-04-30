"use client";

import React, { useEffect } from "react";
import Modal from "react-modal";
import styles from "./Article.module.scss";
import { useImageLightbox } from "@/hooks/useImageLightbox";
import Lightbox from "@/components/Lightbox";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  const parsedText = html.replace(/\\n/g, "\n");
  return (
    <>
      <article ref={containerRef} className={styles.htmlContainer}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsedText}</ReactMarkdown>
      </article>
      <Lightbox
        isOpen={isOpen}
        imageSrc={imageSrc}
        closeLightbox={closeLightbox}
        goToNext={goToNext}
        goToPrev={goToPrev}
        navigation={false}
      />
    </>
  );
};

export default Article;
