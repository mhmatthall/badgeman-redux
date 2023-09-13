import Head from "next/head";
import style from "./Layout.module.scss";

// Here comes the layout!
export default function Layout({ children }) {
  return (
    <div className={style.root}>
      <Head>
        <meta name="theme-color" content="#fff8f5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={style.main}>{children}</div>
    </div>
  );
}
