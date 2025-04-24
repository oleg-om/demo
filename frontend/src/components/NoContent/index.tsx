import { useTranslations } from "next-intl";

export default function NoContent() {
  const t = useTranslations();

  return <span style={{ fontSize: 18 }}>{t("no-data")}</span>;
}
