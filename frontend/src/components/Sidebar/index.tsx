import Link from "next/link";
import { getCategories } from "@/api/facade";
import { ROUTES } from "@/constants/routes";
import clsx from "clsx";
import styles from "./Sidebar.module.scss";
import { useTranslations } from "next-intl";

const Category = ({
  slug,
  name,
  active,
  href,
  isActive,
}: {
  slug: string;
  name: string;
  active?: string;
  href?: string;
  isActive?: boolean;
}) => {
  return (
    <Link
      key={slug}
      className={clsx(styles.link, {
        [styles.active]: active === slug || isActive,
      })}
      href={href || ROUTES.CATEGORY(slug)}
    >
      <span className={styles.text}>{name}</span>
    </Link>
  );
};

const StaticCategories = ({ activeCategory }: { activeCategory?: string }) => {
  const t = useTranslations();
  return (
    <>
      <Category
        slug={ROUTES.HOME}
        name={t("latest")}
        active={activeCategory}
        href={ROUTES.HOME}
        isActive={!activeCategory}
      />
    </>
  );
};

const Sidebar = async ({ activeCategory }: { activeCategory?: string }) => {
  const { data } = await getCategories();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.wrapper}>
        <menu className={styles.menu}>
          <StaticCategories activeCategory={activeCategory} />
          {data.map(({ slug, name }) => (
            <Category
              key={slug}
              slug={slug}
              name={name}
              active={activeCategory}
            />
          ))}
        </menu>
      </div>
    </aside>
  );
};

export default Sidebar;
