// src/pages/index.tsx

import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { getServerAuthSession } from "../server/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SideBarContainer from "components/SideBarContainer";
import MainContainer from "components/MainContainer";
import { FiCheckSquare } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { taskData, TaskDataType } from "../../prisma/zod-utils";
import { api } from "utils/api";
import showToast from "components/ui/core/notification";

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
  const { data: tasks } = api.tasks.list.useQuery();
  const taskForm = useForm<TaskDataType>({
    resolver: zodResolver(taskData),
  });
  const { handleSubmit, register } = taskForm;

  const utils = api.useContext();

  const taskMutation = api.tasks.create.useMutation({
    onSuccess: async () => {
      showToast("Todo succesfully added", "success");
      await utils.tasks.invalidate();
    },
    onError: async (e) => {
      showToast(`${e.message}`, "error");
      await utils.tasks.invalidate();
    },
  });

  const onTaskSubmit = (values: TaskDataType) => {
    console.log("SUBMITTED", values);
    taskMutation.mutate(values);
  };

  // TODO: add optimistic update
  const setCheckedMutation = api.tasks.update.useMutation({
    onSuccess: async () => {
      await utils.tasks.invalidate();
    },
    onError: async () => {
      await utils.tasks.invalidate();
    },
  });

  return (
    <>
      <Head>
        <title>BDD Todo</title>
        <meta name="description" content="todo example app demonstrating BDD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="flex h-screen overflow-hidden"
        data-test-id="authenticated"
      >
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
            <ul
              className="mb-6 space-y-4 overflow-y-scroll"
              id="tasks-list-test"
            >
              {tasks?.map((task) => (
                <li
                  className="flex items-center space-x-2 rounded-md border-gray-100 bg-gray-50 px-4 shadow-sm"
                  key={task.id}
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={task.completed}
                    onChange={() => {
                      setCheckedMutation.mutate({
                        ...task,
                        completed: !task.completed,
                      });
                    }}
                  />
                  <input
                    className="h-full w-full bg-transparent py-6 focus-visible:outline-none"
                    value={task.text}
                    disabled
                  />
                  <div>Hey</div>
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmit(onTaskSubmit)} className="space-x-2">
              <input
                placeholder="What is due for today?"
                className="input-bordered input"
                id="input-test"
                {...register("text")}
              />
              <button
                type="submit"
                className="btn-accent btn"
                id="submit-bttn-test"
              >
                Add
              </button>
            </form>
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
