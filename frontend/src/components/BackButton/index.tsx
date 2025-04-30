import React from "react";
import styles from "./BackButton.module.css";
import clsx from "clsx";

type Props = {
  reverse?: boolean;
  text: string;
  action?: () => void;
};

const BackButton = ({ reverse = false, text, action }: Props) => {
  return (
    <button
      onClick={action}
      className={clsx(styles.button, {
        [styles.reverse]: reverse,
      })}
      aria-label={text}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
        viewBox="0 0 24 24"
      >
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
      <span>{text}</span>
    </button>
  );
};

export default BackButton;
