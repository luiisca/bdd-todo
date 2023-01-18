import { Alert } from "components/Alert";
import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { WEBAPP_URL } from "utils/constants";
import { getServerAuthSession } from "../server/auth";

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [oAuthError, setOAuthError] = useState<boolean>(false);

  useEffect(() => {
    if (router.query?.error) {
      if (router.query?.error === "OAuthAccountNotLinked") {
        // TODO: feat: add redirect page for when provider is incorrect
        console.log("UH OH");
        setOAuthError(true);
        setErrorMessage("Account registered with another provider.");
      } else {
        setOAuthError(true);
        setErrorMessage("Something went wrong. Please try again.");
      }
      // Clean URL to clean error query
      router
        .push(`${WEBAPP_URL as string}/login`, undefined, { shallow: true })
        .catch(console.log);
    }
  }, [router, router.query?.error]);

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#f3f4f6] py-12 sm:px-6 lg:px-8">
      <Image
        className="mx-auto mb-auto"
        src="/logo.png"
        alt="Bdd Todo Logo"
        width={100}
        height={100}
      />
      <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-neutral-900 text-center font-cal text-3xl">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 mb-auto sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border-1 mx-2 rounded-md border-gray-200 bg-white p-4 sm:px-10">
          {oAuthError && (
            <Alert className="mt-4" severity="error" title={errorMessage} />
          )}
          <div className="mt-5">
            <button
              color="secondary"
              className="btn w-full normal-case"
              data-test-id="google"
              onClick={async (e) => {
                e.preventDefault();
                await signIn("google");
              }}
            >
              <FaGoogle className="mr-2 inline-flex h-4 w-4 stroke-[1.5px]" />
              Sign in with Google
            </button>
          </div>
          <div className="my-5">
            <button
              className="btn w-full normal-case"
              data-test-id="github"
              onClick={async (e) => {
                e.preventDefault();
                await signIn("github");
              }}
            >
              <FaGithub className="mr-2 inline-flex h-4 w-4 stroke-[1.5px]" />
              Sign in with Github
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerAuthSession({ req, res });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
