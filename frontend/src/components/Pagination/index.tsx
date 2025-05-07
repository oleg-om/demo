// components/pagination.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Pagination.module.css";
import { PaginationStrapi } from "@/interfaces/strapi";

type PaginationProps = {
  pagination: PaginationStrapi;
};

export default function Pagination({ pagination }: PaginationProps) {
  const pathname = usePathname();
  const currentPage = pagination.page || 1;
  const totalPages = pagination.pageCount || 1;

  function createPageURL(pageNumber: number | string): string {
    const pageStr = String(pageNumber).trim();
    const pageRegex = /\/page\/\d+$/;

    if (pageRegex.test(pathname)) {
      // Заменить существующий номер страницы на новый
      return pathname.replace(pageRegex, `/page/${pageStr}`);
    } else {
      // Убедиться, что нет лишнего слэша в конце
      const cleanPath = pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname;
      return `${cleanPath}/page/${pageStr}`;
    }
  }

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <Link
        href={createPageURL(currentPage - 1)}
        scroll={false}
        className={`${styles.button} ${currentPage === 1 ? styles.disabled : ""}`}
        aria-disabled={currentPage === 1}
      >
        &larr; Prev
      </Link>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={createPageURL(page)}
          scroll={false}
          className={`${styles.button} ${currentPage === page ? styles.active : ""}`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={createPageURL(currentPage + 1)}
        scroll={false}
        className={`${styles.button} ${currentPage === totalPages ? styles.disabled : ""}`}
        aria-disabled={currentPage === totalPages}
      >
        Next &rarr;
      </Link>
    </div>
  );
}
