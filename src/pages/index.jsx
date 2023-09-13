/* eslint-disable @next/next/no-html-link-for-pages */
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormWrapper from "@/components/FormWrapper";
import Layout from "@/components/Layout";
import ProgressIndicator from "@/components/ProgressIndicator";
import TextField from "@/components/TextField";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";

Page.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default function Page() {
  const router = useRouter();
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    resetField,
    setError,
  } = useForm({
    defaultValues: {
      badgeId: "",
      verificationCode: "",
    },
  });

  // We intercept the form submission event so we can give the user feedback without reloading the page
  const onSubmit = async (data, event) => {
    // Prevent browser refresh
    event.preventDefault();

    await axios
      .post("/api/login", data)
      .then((res) => {
        // Redirect to the editor if login was successful
        if (res.status === 200) {
          router.push("/editor");
        }
      })
      .catch((err) => {
        // Show an error message on the form if login was unsuccessful
        setError("root.serverError", {
          type: err.response.status,
          message: err.response.data.message,
        });
      });
  };

  return (
    <>
      <Head>
        <title>badgeman</title>
      </Head>
      <main>
        <Card
          headline="Welcome!"
          subhead="Let's set up your digital name badge."
          description="Enter the details as they appear on your badge."
          variant="outlined"
        >
          {isSubmitting && <ProgressIndicator variant="linear" />}
          <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="badgeId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Badge number"
                  placeholder="e.g. 123"
                  supportingText={errors.badgeId && "Enter a badge number"}
                  trailingIconGlyph="cancel"
                  onTrailingIconClick={() => resetField("badgeId")}
                  fieldType="text"
                  htmlName="badgeId"
                  variant="outlined"
                  ref={null}
                />
              )}
            />
            <Controller
              name="verificationCode"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Secret code"
                  placeholder="e.g. a1b2"
                  supportingText={errors.verificationCode && "Enter a code"}
                  trailingIconGlyph="cancel"
                  onTrailingIconClick={() => resetField("verificationCode")}
                  fieldType="text"
                  htmlName="verificationCode"
                  variant="outlined"
                  ref={null}
                />
              )}
            />
            {errors.root?.serverError && (
              <div>
                <p>{errors.root?.serverError.message}</p>
              </div>
            )}
            <Button
              label="Enter"
              variant="filled"
              type="submit"
              disabled={isSubmitting}
            />
          </FormWrapper>
        </Card>
      </main>
    </>
  );
}
