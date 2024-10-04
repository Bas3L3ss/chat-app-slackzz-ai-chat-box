"use client";
import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import slugify from "slugify";
import { v4 as uuid } from "uuid";
import Typography from "@/components/ui/typography";
import { userCreateWorkspaceValues } from "@/hooks/create-workspace-values";
import { createWorkspace } from "@/actions/create-workspace";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

function CreateWorkSpace() {
  const { currStep } = userCreateWorkspaceValues();

  let stepInView = null;

  switch (currStep) {
    case 1:
      stepInView = <Step1 />;
      break;
    case 2:
      stepInView = <Step2 />;
      break;

    default:
      stepInView = <Step1 />;
  }
  return (
    <div className="w-screen h-screen grid place-content-center bg-neutral-800 text-white">
      <div className="p-3 max-w-[550px]">
        <Typography
          variant="p"
          text={`step ${currStep} of 2`}
          className="text-neutral-400"
        />

        {stepInView}
      </div>
    </div>
  );
}

export default CreateWorkSpace;

const Step1 = () => {
  const { name, updateValues, setCurrStep } = userCreateWorkspaceValues();
  return (
    <>
      <Typography
        text="What is the name of your company or team"
        className="my-4"
      />
      <Typography
        text="This will be the name of your Slackzz workspace - choose something that your team will recognize."
        className="text-neutral-300"
        variant="p"
      />
      <form className="mt-6">
        <Input
          className="bg-neutral-700 text-white border-neutral-600"
          type="text"
          value={name}
          placeholder="Enter your workspace name"
          onChange={(e) => updateValues({ name: e.target.value })}
        />
        <Button
          type="button"
          className="mt-10"
          onClick={() => setCurrStep(2)}
          disabled={!name}
        >
          <Typography text="Next" variant="p" />
        </Button>
      </form>
    </>
  );
};
const Step2 = () => {
  const { setCurrStep, updateImageUrl, imageUrl, name } =
    userCreateWorkspaceValues();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const slug = slugify(name);
    const invite_code = uuid();
    const error = await createWorkspace({ imageUrl, name, slug, invite_code });
    setIsSubmitting(false);

    if (error?.error) {
      console.log(error);
      return toast({
        title: "Error",
        description: "Something went wrong, please try again later.",
        variant: "destructive",
      });
    }
    toast({
      title: "All Done!",
      description: "New workspace created",
    });
    router.push("/");
  };

  return (
    <>
      <Button
        size={"sm"}
        className="text-white"
        variant={"link"}
        onClick={() => setCurrStep(1)}
      >
        <Typography text="Back" variant="p" />
      </Button>
      <form>
        <Typography text="Add workspace avatar" className="my-4" />
        <Typography
          text="This image can be changed later in your workspace settings"
          className="text-neutral-300"
          variant="p"
        />
        <fieldset
          disabled={isSubmitting}
          className="mt-6 flex flex-col items-center space-y-9"
        >
          <ImageUpload />
          <div className="space-x-5">
            <Button
              onClick={() => {
                updateImageUrl("");
                handleSubmit();
              }}
            >
              <Typography text="Skip for now" variant="p" />
            </Button>
            {imageUrl ? (
              <Button
                className="button"
                onClick={handleSubmit}
                size={"sm"}
                variant={"destructive"}
              >
                <Typography text="Submit" variant="p" />
              </Button>
            ) : (
              <Button
                type="button"
                className="text-white bg-gray-500"
                size={"sm"}
              >
                <Typography text="Select an Image" variant="p" />
              </Button>
            )}
          </div>
        </fieldset>
      </form>
    </>
  );
};
