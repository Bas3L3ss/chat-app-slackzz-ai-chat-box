"use client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Typography from "@/components/ui/typography";
import { BsSlack } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { RxGithubLogo } from "react-icons/rx";
import { Input } from "@/components/ui/input";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { Provider } from "@supabase/supabase-js";
import { registerWithEmail } from "@/actions/register-with-email";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";

function AuthPage() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const getCurrUser = async () => {
      const {
        data: { user },
      } = await supabaseBrowserClient.auth.getUser();

      if (user) {
        return router.push("/");
      }
    };
    getCurrUser();
    setIsMounted(true);
  }, [router]);

  const formSchema = z.object({
    email: z
      .string()
      .email({ message: "Please provide a proper email" })
      .min(2, { message: "Email must be 2 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAuthenticating(true);

    const res = await registerWithEmail(values);
    const { error } = JSON.parse(res);

    setIsAuthenticating(false);
    if (error) {
      console.warn("sign in error", error);
      return;
    }
  }

  async function socialAuth(provider: Provider) {
    setIsAuthenticating(true);
    await supabaseBrowserClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    setIsAuthenticating(false);
  }

  if (!isMounted) return null;
  return (
    <div className="min-h-screen grid p-5 text-center place-content-center bg-white ">
      <div className="max-w-[450px]">
        <div className="flex justify-center items-center gap-3 mb-4">
          <BsSlack size={30} />
          <Typography text="Slackzz" variant="h2" />
        </div>
        <Typography
          text="Sign in to your Slackzz"
          variant="h2"
          className="mb-3"
        />

        <Typography
          text="We suggest using the email address that you use at work"
          variant="p"
          className="mb-7 opacity-90"
        />
        <div className="flex-col flex space-y-4">
          <Button
            disabled={isAuthenticating}
            onClick={() => {
              socialAuth("google");
            }}
            variant={"outline"}
            className="py-6 border-2 flex space-x-3"
          >
            <FcGoogle size={30} />
            <Typography
              text="Sign in with google"
              className="text-lg"
              variant="p"
            />
          </Button>
          <Button
            disabled={isAuthenticating}
            variant={"outline"}
            onClick={() => {
              socialAuth("github");
            }}
            className="py-6 border-2 flex space-x-3"
          >
            <RxGithubLogo size={30} />
            <Typography
              text="Sign in with github"
              className="text-lg"
              variant="p"
            />
          </Button>
        </div>

        <div>
          <div className="flex items-center my-6">
            <div className="mr-[10px] flex-1 border-t bg-neutral-300" />
            <Typography text="OR" variant="p" />
            <div className="ml-[10px] flex-1 border-t bg-neutral-300" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset disabled={isAuthenticating}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="name@work-email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant={"secondary"}
                  className="bg-primary-dark hover:bg-primary-dark/90 w-full my-5 text-white"
                  type="submit"
                >
                  <Typography variant="p" text="Sign in with Email" />
                </Button>
                <div className="px-5 py-4 bg-gray-100 rounded-sm ">
                  <div className="text-gray-500 flex space-x-3">
                    <MdOutlineAutoAwesome />
                    <Typography
                      text="We will email you a magic link for a password-free sign-in"
                      variant="p"
                    />
                  </div>
                </div>
              </fieldset>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
