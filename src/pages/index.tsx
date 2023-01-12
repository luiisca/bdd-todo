import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { getServerAuthSession } from "../server/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SideBarContainer from "components/SideBarContainer";
import MainContainer from "components/MainContainer";
import { FiCheckSquare } from "react-icons/fi";

const useRedirectToLoginIfUnauthenticated = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  useEffect(() => {
    if (!loading && !session) {
      router
        .replace({
          pathname: "/login",
        })
        .catch(console.log);
    }
  }, [router, loading, session]);

  return {
    loading: loading && !session,
    session,
  };
};

const Home: NextPage = () => {
  useRedirectToLoginIfUnauthenticated();
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>BDD Todo</title>
        <meta name="description" content="todo example app demonstrating BDD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen overflow-hidden">
        <SideBarContainer />
        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <MainContainer
            heading={`Good Morning${
              (sessionData?.user && `, ${sessionData.user.name || "User"}`) ||
              ", User"
            }`}
            subtitle="Wednesday, Feb 2023"
            HeadingLeftIcon={
              <FiCheckSquare className="h-8 w-8 text-blue-400" />
            }
            large
          >
            <div>Hello world</div>
          </MainContainer>
        </div>
      </div>
    </>
  );
};

export default Home;

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user?.id) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {},
  };
}
