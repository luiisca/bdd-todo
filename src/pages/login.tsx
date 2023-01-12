<<<<<<< HEAD
import { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
=======
import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import Image from "next/image";
>>>>>>> learning-jest-cucumber
import { FaGoogle, FaGithub } from "react-icons/fa";
import { getServerAuthSession } from "../server/auth";

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#f3f4f6] py-12 sm:px-6 lg:px-8">
<<<<<<< HEAD
      <img
        className="mx-auto mb-auto w-[100px]"
        src="/logo.png"
        alt="Bdd Todo Logo"
=======
      <Image
        className="mx-auto mb-auto"
        src="/logo.png"
        alt="Bdd Todo Logo"
        width={100}
        height={100}
>>>>>>> learning-jest-cucumber
      />
      <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-neutral-900 text-center font-cal text-3xl">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 mb-auto sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border-1 mx-2 rounded-md border-gray-200 bg-white p-4 sm:px-10">
          <div className="mt-5">
            <button
              color="secondary"
              className="btn w-full normal-case"
              onClick={async (e) => {
                e.preventDefault();
                await signIn("google");
<<<<<<< HEAD
=======
                return;
>>>>>>> learning-jest-cucumber
              }}
            >
              <FaGoogle className="mr-2 inline-flex h-4 w-4 stroke-[1.5px]" />
              Sign in with Google
            </button>
          </div>
          <div className="my-5">
            <button
              className="btn w-full normal-case"
              onClick={async (e) => {
                e.preventDefault();
                await signIn("github");
<<<<<<< HEAD
=======
                return;
>>>>>>> learning-jest-cucumber
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
