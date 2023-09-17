import Card from "@/components/Card";
import Layout from "@/components/Layout";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";

Page.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default function Page() {
  // Get data for all badges from the DB
  const [badges, setBadges] = useState(null);
  useEffect(() => {
    axios.get("/api/badges").then((res) => setBadges(res.data));
  }, []);

  return (
    <div>
      <Head>
        <title>badgeman</title>
      </Head>
      <main>
        <Card variant="outlined">
          <h1>Get started</h1>
          <h2>1. Connect to the network</h2>
          <p>
            On your device, connect to the{" "}
            <code>
              <strong>{process.env.NEXT_PUBLIC_WLAN_SSID}</strong>
            </code>{" "}
            WiFi network using password:{" "}
            <code>
              <strong>{process.env.NEXT_PUBLIC_WLAN_PASSWORD}</strong>
            </code>
          </p>
          <h2>2. Open the badge editor</h2>
          <p>
            Using your device, scan the QR code on the badge. Or, open your
            browser and go to{" "}
            <code>
              <strong>{`${process.env.NEXT_PUBLIC_HOST_IP_ADDRESS}:${process.env.NEXT_PUBLIC_HOST_PORT}`}</strong>
            </code>
          </p>
          <h2>3. Create your badge</h2>
          <p>
            Enter your details, click <strong>Save changes</strong>, and your
            badge will update automatically. You can change the badge details as
            many times as you like!
          </p>
        </Card>
        <Card variant="filled">
          <h1>Connected badges</h1>
          {badges && (
            <div>
              {badges
                .filter((badge) => badge.userData.name !== "")
                .map((badge) => (
                  <div key={badge.currentId}>
                    <h1>{badge.userData.name}</h1>
                    <h2>{badge.userData.affiliation}</h2>
                    <p>{badge.userData.pronouns}</p>
                    {badge.userData.message && (
                      <p>{`"` + badge.userData.message.trim() + `"`}</p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
