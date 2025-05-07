"use server";
import styles from "./Cards.module.scss";
import Card from "@/components/Card";
import { ArticleInterface } from "@/interfaces/article";
import NoContent from "@/components/NoContent";
import { PaginationStrapi } from "@/interfaces/strapi";
import Pagination from "@/components/Pagination";

export type CardsProps = {
  data: ArticleInterface[];
  pagination: PaginationStrapi;
};

const Cards = async ({ data, pagination }: CardsProps) => {
  if (!data?.length) {
    return <NoContent />;
  }

  return (
    <main className={styles.cards}>
      {data.map((a) => (
        <Card article={a} key={a.slug} />
      ))}
      <Pagination pagination={pagination} />
    </main>
  );
};

export default Cards;
