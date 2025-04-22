import styles from "./Title.module.scss";

export const Title = ({ text }: { text: string }) => {
  return <h1 className={styles.text}>{text}</h1>;
};
