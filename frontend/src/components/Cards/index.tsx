"use server";
import styles from "./Cards.module.scss";
import Card from "@/components/Card";
import { ArticleInterface } from "@/interfaces/article";
import NoContent from "@/components/NoContent";

export type CardsProps = {
  data: ArticleInterface[];
};

const Cards = async ({ data }: CardsProps) => {
  if (!data?.length) {
    return <NoContent />;
  }
  return (
    <main className={styles.cards}>
      {data.map((a) => (
        <Card article={a} key={a.slug} />
      ))}
    </main>
  );
};

export default Cards;
