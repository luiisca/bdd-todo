import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FiHome, FiLogOut, FiPlus } from "react-icons/fi";

export const UserCard = ({
  image,
  name,
  position = "row",
}: {
  image: string;
  name: string | undefined | null;
  position?: "col" | "row";
}) => {
  return (
    <div
      className={classNames(
        position === "row" ? "flex-row" : "flex-col-reverse",
        "group flex w-full appearance-none items-center rounded-full p-2 text-left outline-none sm:ml-1 md:ml-0 md:rounded-md lg:flex-row",
        "hover:bg-gray-100"
      )}
    >
      {/*Avatar*/}
      <span
        className={classNames(
          "mr-2 h-8 w-8 lg:h-9 lg:w-9",
          "relative flex-shrink-0 rounded-full bg-gray-300"
        )}
      >
        <Image
          src={image}
          alt={name || "Nameless user"}
          className="rounded-full"
          fill
        />
      </span>
      {/*Text*/}
      <span className="flex flex-grow items-center truncate">
        <span className="hidden flex-grow truncate text-sm lg:flex">
          <span className="block truncate font-medium text-gray-900">
            {name || "Nameless User"}
          </span>
        </span>
        <a
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex cursor-pointer items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
        >
          <FiLogOut
            className={classNames(
              "text-gray-500 group-hover:text-gray-700",
              "mr-2 h-4 w-4 flex-shrink-0 "
            )}
            aria-hidden="true"
          />
        </a>
      </span>
    </div>
  );
};

export default function SideBarContainer() {
  const { data: sessionData, status } = useSession();

  return (
    <aside className="hidden w-14 flex-col border-r border-gray-100 bg-gray-50 md:flex lg:w-56 lg:flex-shrink-0 lg:px-4 ">
      {(status !== "loading" && status !== "authenticated") ||
      !sessionData ? null : (
        <>
          <div className="flex h-0 flex-1 flex-col overflow-y-auto pt-3 pb-4 lg:pt-5">
            <nav className="mt-2 flex-1 space-y-2 md:px-2 lg:mt-5 lg:px-0">
              <Link
                href="/"
                className={classNames(
                  "group flex items-center rounded-md py-2 px-3 text-sm font-medium lg:px-[14px]",
                  "bg-gray-200 text-gray-900"
                )}
              >
                <FiHome className="mr-3 h-4 w-4 flex-shrink-0 text-gray-500 text-inherit" />
                <span className="hidden w-full justify-between lg:flex">
                  <div className="flex">Home</div>
                </span>
              </Link>
              <button className="hover:text-neutral-900 flex w-full items-center rounded-md py-2 px-3 text-sm font-medium normal-case text-gray-800 hover:bg-gray-100 lg:px-[14px]">
                <FiPlus className="mr-3 h-4 w-4 flex-shrink-0 text-gray-500 text-inherit" />
                <span
                  className="hidden justify-between lg:flex"
                  onClick={() => {
                    console.log("adding new to-do");
                  }}
                >
                  <div className="flex">New to-do</div>
                </span>
              </button>
            </nav>
          </div>
          <div className="mb-2">
            {sessionData.user && (
              <UserCard
                image={sessionData.user.image as string}
                name={sessionData.user.name}
                position="col"
              />
            )}
          </div>
        </>
      )}
    </aside>
  );
}
