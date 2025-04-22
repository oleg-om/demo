import styles from "./not-found.module.scss";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  const t = useTranslations();
  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <h1 className={styles.title}>404 – {t("not-found")}</h1>
        <Link href={ROUTES.HOME} className={styles.button}>
          {t("go-back-to-main-page")}
        </Link>
      </div>
    </>
  );
}
