// src/pages/index.tsx

import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { getServerAuthSession } from "../server/auth";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import SideBarContainer from "components/SideBarContainer";
import MainContainer from "components/MainContainer";
import { FiCheckSquare } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { taskData, TaskDataType } from "../../prisma/zod-utils";
import { api } from "utils/api";
import showToast from "components/ui/core/notification";
import dayjs from "dayjs";
import { getDayPeriod } from "utils/parseDate";

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
  const [tasksAnimationParentRef] = useAutoAnimate<HTMLUListElement>();
  const text = useRef();

  const utils = api.useContext();
  useEffect(() => {
    console.log(text.current);
  });

  const taskMutation = api.tasks.create.useMutation({
    onMutate: async ({ text, completed }) => {
      taskForm.reset();
      await utils.tasks.list.cancel();

      const oldTasksList = utils.tasks.list.getData();
      if (oldTasksList) {
        const newList = [...oldTasksList];

        if (sessionData?.user?.id)
          utils.tasks.list.setData(undefined, [
            {
              text,
              completed: Boolean(completed),
              id: oldTasksList.length + 1,
              createdAt: new Date(),
              userId: sessionData.user.id,
            },
            ...newList,
          ]);
      }

      return { oldTasksList };
    },
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
    if (values.text.replace(/\s/g, "") === "") {
      return;
    }
    taskMutation.mutate(values);
  };

  const setCheckedMutation = api.tasks.update.useMutation({
    onMutate: async ({ position }) => {
      await utils.tasks.list.cancel();

      const oldTasksList = utils.tasks.list.getData();
      if (oldTasksList && position !== undefined) {
        const newList = [...oldTasksList];

        if (newList[position]) {
          newList[position]!.completed = !newList[position]!.completed;
        }

        utils.tasks.list.setData(undefined, [...newList]);
      }

      return { oldTasksList };
    },
    onSuccess: async () => {
      await utils.tasks.invalidate();
    },
    onError: async (err, _, context) => {
      if (context?.oldTasksList) {
        utils.tasks.list.setData(undefined, context.oldTasksList);
      }
      console.error(err);
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
            heading={`Good ${getDayPeriod()}${
              (sessionData?.user && `, ${sessionData.user.name || "User"}`) ||
              ", User"
            }`}
            subtitle={dayjs().format("ddd, D MMM YYYY").toString()}
            HeadingLeftIcon={
              <FiCheckSquare className="h-8 w-8 text-blue-400" />
            }
            large
          >
            <ul
              className="mb-6 h-full space-y-4 overflow-y-auto overflow-x-hidden pr-4"
              id="tasks-list-test"
              ref={tasksAnimationParentRef}
            >
              {tasks?.map((task, id) => (
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
                        position: id,
                      });
                    }}
                  />
                  <input
                    className="h-full w-full bg-transparent py-6 focus-visible:outline-none"
                    value={task.text}
                    disabled
                  />
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmit(onTaskSubmit)} className="space-x-2">
              <input
                autoFocus
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
