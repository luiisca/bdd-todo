import classNames from "classnames";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren, ReactElement } from "react";
import { UserCard } from "./SideBarContainer";

const Logo = () => {
  return (
    <h1>
      <strong className="relative inline-block h-12 w-12">
        <Image className="mx-auto" alt="todo app logo" src="/logo.png" fill />
      </strong>
    </h1>
  );
};

const TopNav = () => {
  const { data: sessionData, status } = useSession();

  if ((status !== "loading" && status !== "authenticated") || !sessionData)
    return null;

  return (
    <nav className="fixed z-40 flex w-full items-center justify-between border-b border-gray-200 bg-gray-50 bg-opacity-50 py-1.5 px-4 backdrop-blur-lg sm:relative sm:p-4 md:hidden">
      <Link href="/simulation">
        <Logo />
      </Link>
      <div className="flex items-center gap-2 self-center">
        {sessionData.user && (
          <UserCard
            image={sessionData.user.image as string}
            name={sessionData.user.name}
          />
        )}
      </div>
    </nav>
  );
};

export default function MainContainer({
  heading,
  large,
  HeadingLeftIcon,
  subtitle,
  children,
}: PropsWithChildren & {
  heading?: string;
  subtitle?: string;
  HeadingLeftIcon?: ReactElement;
  large?: boolean;
}) {
  return (
    <main className="flex flex-1 flex-col bg-white focus:outline-none">
      <TopNav />
      <div className="flex h-screen flex-col px-4 py-2 lg:py-8 lg:px-12">
        <div className="flex items-baseline sm:mt-0">
          {heading && (
            <header
              className={classNames(
                large && "py-8",
                "mb-4 flex w-full items-center pt-4 md:p-0 lg:mb-10"
              )}
            >
              {HeadingLeftIcon && <div className="mr-4">{HeadingLeftIcon}</div>}
              <div className="mr-4 w-full sm:block">
                {heading && (
                  <h1 className="mb-1  font-cal text-xl font-bold capitalize tracking-wide text-black">
                    {heading}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-neutral-500 hidden text-sm sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </header>
          )}
        </div>
        {children}
      </div>
    </main>
  );
}
