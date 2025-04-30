"use client";
import styles from "./page.module.scss";
import BackButton from "@/components/BackButton";
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function ArticleButtons({
  nextArticle,
}: {
  nextArticle?: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const goPrevious = () => {
    router.push(ROUTES.HOME);
  };
  const goNext = () => {
    router.push(ROUTES.ARTICLE(nextArticle!));
  };

  return (
    <div className={styles.buttons}>
      <BackButton text={t("go-back")} action={goPrevious} />
      {!!nextArticle && (
        <BackButton text={t("go-next")} reverse={true} action={goNext} />
      )}
    </div>
  );
}
