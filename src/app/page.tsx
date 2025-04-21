import styles from "./page.module.scss";
import { useTranslations } from "next-intl";
import Cards from "@/components/Cards";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const t = useTranslations();

  return (
    <div className={styles.page}>
      <Sidebar />
      <Cards />
    </div>
  );
}
