import styles from "./Author.module.scss";
import React from "react";
import { CategoryInterface } from "@/interfaces/category";
import { AuthorInterface } from "@/interfaces/author";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

type Props = {
  author: AuthorInterface;
  category: CategoryInterface;
  date: string;
};

const Author: React.FC<Props> = ({ author, category, date }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.author}>
        <Link href={ROUTES.AUTHOR(author.slug)} className={styles.image}>
          <Image
            className={styles.image}
            src={author.image}
            alt={author.name}
            width={50}
            height={50}
          />
        </Link>
        <span className={styles.inner}>
          <Link href={ROUTES.AUTHOR(author.slug)} className={styles.name}>
            {author.name}
          </Link>
          <Link
            href={ROUTES.CATEGORY(category.slug)}
            className={styles.category}
          >
            {category.name}
          </Link>
        </span>
      </div>
      <span className={styles.date}>{date}</span>
    </div>
  );
};

export default Author;
