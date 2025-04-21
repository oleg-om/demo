import styles from "@/components/Article/Article.module.scss";
import Modal from "react-modal";
import React from "react";

type Props = {
  isOpen: boolean;
  imageSrc: string | null;
  closeLightbox: () => void;
  goToNext: () => void;
  goToPrev: () => void;
};

const Lightbox = ({
  isOpen,
  imageSrc,
  closeLightbox,
  goToNext,
  goToPrev,
}: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeLightbox}
      contentLabel="Image Lightbox"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <button onClick={closeLightbox} className={styles.closeButton}>
        &times;
      </button>
      <button className={styles.prevButton} onClick={goToPrev}>
        &#8592;
      </button>
      <img
        src={imageSrc ?? ""}
        alt="Lightbox"
        className={styles.lightboxImage}
        onClick={closeLightbox}
      />
      <button className={styles.nextButton} onClick={goToNext}>
        &#8594;
      </button>
    </Modal>
  );
};

export default Lightbox;
