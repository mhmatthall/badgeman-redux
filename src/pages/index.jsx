import Button from "@/components/Button";
import Card from "@/components/Card";
import TextField from "@/components/TextField";
import style from "@/styles/Default.module.scss";
import Head from "next/head";

export default function Home() {
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
            <div className={style.stacked}>
              <TextField
                label={"Badge code"}
                placeholderText={"••••"}
                trailingIcon={"cancel"}
              />
              <Button
                variant={"filled"}
                href={"/edit"}
                label={"Start editing"}
                />
            </div>
          }
        />
      </main>
    </div>
  );
}
