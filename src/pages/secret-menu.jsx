import BadgePreviewer from "@/components/BadgePreviewer";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormWrapper from "@/components/FormWrapper";
import Layout from "@/components/Layout";
import ProgressIndicator from "@/components/ProgressIndicator";
import TextField from "@/components/TextField";
import { generate } from "@/lib/auth/secret";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

Page.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default function Page() {
  return (
    <div>
      <Head>
        <title>Admin &ndash; badgeman</title>
      </Head>
      <main>
        <Card variant="outlined">
          <h1>Secret menu</h1>
          <h2>Badge inspector</h2>
          <BadgeInspector />
          {/* <h2>Announcer</h2>
          <p>Coming soon...</p> */}
        </Card>
      </main>
    </div>
  );
}

function BadgeInspector() {
  const [statusMessage, setStatusMessage] = useState("");
  const [badgeData, setBadgeData] = useState(null);

  const {
    control,
    formState: { isSubmitting, isDirty },
    getValues,
    handleSubmit,
    reset,
  } = useForm();

  const getBadge = (data, event) => {
    // Prevent browser refresh
    event.preventDefault();

    // Reset status message
    setStatusMessage("");

    // Fetch badge data
    axios
      .get("/api/badges/" + data.badgeId)
      .then((res) => {
        if (res.status === 200) {
          setBadgeData(res.data);
          setStatusMessage("");
        } else {
          setBadgeData(null);
          reset();
          throw new Error(res);
        }
      })
      .catch((err) => {
        setStatusMessage(err.message);
      });
  };

  const resetBadge = async (data, event) => {
    // Prevent browser refresh
    event.preventDefault();

    // Reset status message
    setStatusMessage("");

    await axios
      .delete("/api/badges/" + data.badgeId)
      .then((res) => {
        if (res.status === 200) {
          setStatusMessage(
            `Badge ${getValues("badgeId")} was reset successfully`
          );
          setBadgeData(null);
          reset();
        } else {
          setBadgeData(null);
          reset();
          throw new Error(res);
        }
      })
      .catch((err) => {
        setStatusMessage(err.message);
      });
  };

  return (
    <>
      {statusMessage && <p>{statusMessage}</p>}
      {isSubmitting && <ProgressIndicator variant="linear" />}
      <FormWrapper onSubmit={handleSubmit(getBadge)}>
        <Controller
          name="badgeId"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Badge ID"
              placeholder="e.g. 123"
              trailingIconGlyph="cancel"
              onTrailingIconClick={() => {
                setBadgeData(null);
                setStatusMessage("");
                reset();
              }}
              fieldType="text"
              htmlName="badgeId"
              variant="outlined"
              ref={null}
            />
          )}
        />
        <Button
          label="View badge"
          type="submit"
          variant="filled"
          disabled={isSubmitting || !isDirty}
        />
      </FormWrapper>
      {badgeData && !isSubmitting && (
        <Card
          variant="filled"
          style={{ alignSelf: "center" }}
          actions={
            <Button
              label="Reset badge"
              onClick={handleSubmit(resetBadge)}
              variant="outlined"
            />
          }
        >
          <h2>Info</h2>
          <p>
            <b>Badge ID:</b> <code>{getValues("badgeId")}</code>
          </p>
          <p>
            <b>Secret code:</b> <code>{generate(getValues("badgeId"))}</code>
          </p>
          <p>
            <b>Updated:</b> {new Date(badgeData.lastUpdate).toLocaleString()}
          </p>
          <p>
            <b>Device MAC:</b> <code>{badgeData.macAddress}</code>
          </p>
          <hr />
          <h2>User data</h2>
          <BadgePreviewer badgeData={badgeData} />
          <p>
            <b>Name:</b>
            <br />
            <code>{badgeData.userData.name}</code>
          </p>
          <p>
            <b>Pronouns:</b>
            <br />
            <code>{badgeData.userData.pronouns}</code>
          </p>
          <p>
            <b>Affiliation:</b>
            <br />
            <code>{badgeData.userData.affiliation}</code>
          </p>
          <p>
            <b>Message:</b>
            <br />
            <code>{badgeData.userData.message}</code>
          </p>
          <hr />
          <h2>Actions</h2>
        </Card>
      )}
    </>
  );
}
