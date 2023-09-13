import Button from "@/components/Button";
import Card from "@/components/Card";
import FormWrapper from "@/components/FormWrapper";
import Layout from "@/components/Layout";
import ProgressIndicator from "@/components/ProgressIndicator";
import TextField from "@/components/TextField";
import axios from "axios";
import { createHash } from "crypto";
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
        <ViewSecret />
        <br />
        <ResetForm />
      </main>
    </div>
  );
}

function ViewSecret() {
  const [secretCode, setsecretCode] = useState("");

  const {
    control,
    formState: { isSubmitting, isDirty },
    handleSubmit,
    setValue,
  } = useForm();

  const onSubmit = async (data, event) => {
    // Prevent browser refresh
    event.preventDefault();

    const secretCode = createHash("md5")
      .update(data.badgeId)
      .digest("hex")
      .substring(1, 5);

    setsecretCode(secretCode);
  };

  return (
    <Card subhead="View secret code" variant="outlined">
      {isSubmitting && <ProgressIndicator variant="linear" />}
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="badgeId"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Badge ID"
              placeholder="e.g. 123"
              trailingIconGlyph="cancel"
              onTrailingIconClick={() =>
                setValue("badgeId", "", { shouldDirty: true })
              }
              fieldType="text"
              htmlName="badgeId"
              variant="outlined"
              ref={null}
            />
          )}
        />
        {secretCode && (
          <div>
            <p>{secretCode}</p>
          </div>
        )}
        <Button
          label="Check secret"
          type="submit"
          variant="filled"
          style={{ width: "100%" }}
          disabled={isSubmitting || !isDirty}
        />
      </FormWrapper>
    </Card>
  );
}

function ResetForm() {
  const [isSuccessful, setisSuccessful] = useState(false);

  const {
    control,
    formState: { isSubmitting, isDirty },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  const badgeResetter = async (data, event) => {
    // Prevent browser refresh
    event.preventDefault();

    await axios
      .delete("/api/badges/" + data.badgeId)
      .then((res) => {
        if (res.status === 200) {
          setisSuccessful(true);
          reset();
        } else {
          console.error(res);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Card subhead="Reset a badge" variant="outlined">
      {isSubmitting && <ProgressIndicator variant="linear" />}
      <FormWrapper onSubmit={handleSubmit(badgeResetter)}>
        <Controller
          name="badgeId"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Badge ID"
              placeholder="e.g. 123"
              trailingIconGlyph="cancel"
              onTrailingIconClick={() =>
                setValue("badgeId", "", { shouldDirty: true })
              }
              fieldType="text"
              htmlName="badgeId"
              variant="outlined"
              ref={null}
            />
          )}
        />
        {isSuccessful && (
          <div>
            <p>Successfully deleted badge</p>
          </div>
        )}
        <Button
          label="Reset badge"
          type="submit"
          variant="filled"
          style={{ width: "100%" }}
          disabled={isSubmitting || !isDirty}
        />
      </FormWrapper>
    </Card>
  );
}
