import { useTranslations } from "next-intl";
import styles from "./Subtitle.module.scss";

export const SubTitle = ({ text }: { text: string }) => {
  const t = useTranslations();
  return <h2 className={styles.text}>{t(text)}</h2>;
};
