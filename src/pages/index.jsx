import Card from "@/components/Card";
import TextField from "@/components/TextField";
import style from "@/styles/Default.module.scss";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  async function submitBadgeCode(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: e.target.code.value.toLowerCase(),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={style.root}>
      <Head>
        <title>badgeman</title>
      </Head>
      <main className={style.main}>
        <Card
          variant={"outlined"}
          headline={"Welcome!"}
          subhead={"Let's setup your digital name badge."}
          actionsAlignment="stretch"
          actions={
            <form onSubmit={submitBadgeCode} className={style.stacked}>
              <TextField
                label={"Badge code"}
                placeholderText={"••••"}
                trailingIcon={"cancel"}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Start editing"}
              </button>
            </form>
          }
        />
      </main>
    </div>
  );
}
