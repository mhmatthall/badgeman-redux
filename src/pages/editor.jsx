import Button from "@/components/Button";
import Card from "@/components/Card";
import FormWrapper from "@/components/FormWrapper";
import Layout from "@/components/Layout";
import ProgressIndicator from "@/components/ProgressIndicator";
import TextField from "@/components/TextField";
import { useBadge } from "@/lib/auth/useBadge";
import { withSessionSsr } from "@/lib/auth/withSession";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

Page.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const badgeId = req.session?.badgeId;

  if (!badgeId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      badgeId,
    },
  };
});

export default function Page({ badgeId }) {
  const router = useRouter();
  const { badge, isLoading } = useBadge(badgeId);
  const [isSuccessful, setisSuccessful] = useState(false);

  const {
    control,
    formState: { isSubmitting, isDirty },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  const onSubmit = (data, event) => {
    // Prevent browser refresh
    event.preventDefault();

    // Update badge data
    axios
      .put("/api/badges/" + badgeId, data)
      .then((res) => {
        if (res.status === 200) {
          setisSuccessful(true);
          router.reload();
        } else {
          throw new Error(res);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (isLoading) {
    return <ProgressIndicator variant="linear" />;
  }

  return (
    <div>
      <Head>
        <title>Editor &ndash; badgeman</title>
      </Head>
      <main>
        <Card variant="outlined">
          {isSubmitting && <ProgressIndicator variant="linear" />}
          <h2>Editing badge #{badgeId}</h2>
          <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              defaultValue={badge.userData.name}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  placeholder="e.g. Toby Larone"
                  trailingIconGlyph="cancel"
                  onTrailingIconClick={() =>
                    setValue("name", "", { shouldDirty: true })
                  }
                  fieldType="text"
                  htmlName="name"
                  variant="outlined"
                  ref={null}
                />
              )}
            />
            <Controller
              name="pronouns"
              control={control}
              defaultValue={badge.userData.pronouns}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pronouns"
                  placeholder="e.g. she/her"
                  trailingIconGlyph="cancel"
                  onTrailingIconClick={() =>
                    setValue("pronouns", "", { shouldDirty: true })
                  }
                  fieldType="text"
                  htmlName="pronouns"
                  variant="outlined"
                  ref={null}
                />
              )}
            />
            <Controller
              name="affiliation"
              control={control}
              defaultValue={badge.userData.affiliation}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Affiliation"
                  placeholder="e.g. Swansea University"
                  trailingIconGlyph="cancel"
                  onTrailingIconClick={() =>
                    setValue("affiliation", "", { shouldDirty: true })
                  }
                  fieldType="text"
                  htmlName="affiliation"
                  variant="outlined"
                  ref={null}
                />
              )}
            />
            <Controller
              name="message"
              control={control}
              defaultValue={badge.userData.message}
              rules={{ required: false }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Message"
                  placeholder="e.g. I hate computers :)"
                  trailingIconGlyph="cancel"
                  onTrailingIconClick={() =>
                    setValue("message", "", { shouldDirty: true })
                  }
                  fieldType="text"
                  htmlName="message"
                  variant="outlined"
                  ref={null}
                />
              )}
            />
            {isSuccessful && (
              <div>
                <p>Changes saved successfully!</p>
              </div>
            )}
            <Button
              label="Save changes"
              type="submit"
              variant="filled"
              style={{ width: "100%" }}
              disabled={isSubmitting || !isDirty}
            />
            <Button
              label="Reset changes"
              onClick={() => {
                reset();
              }}
              variant="outlined"
              style={{ width: "100%" }}
              disabled={isSubmitting || !isDirty}
            />
          </FormWrapper>
          <hr />
          <Button
            label="Edit a different badge"
            onClick={() =>
              axios.post("/api/logout").then(() => router.push("/"))
            }
            variant="tonal"
            style={{ width: "100%" }}
          />
        </Card>
      </main>
    </div>
  );
}
