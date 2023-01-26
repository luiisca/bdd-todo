import classNames from "classnames";
import toast from "react-hot-toast";
import { FiCheck, FiInfo } from "react-icons/fi";

export default function showToast(
  message: string,
  variant: "success" | "warning" | "error"
) {
  switch (variant) {
    case "success":
      toast.custom(
        (t) => (
          <div
            className={classNames(
              "data-testid-toast-success mb-2 flex h-9 items-center space-x-2 rounded-md bg-blue-500 p-3 text-sm font-semibold text-white shadow-md",
              t.visible && "animate-fade-in-up"
            )}
          >
            <FiCheck className="h-4 w-4" />
            <p>{message}</p>
          </div>
        ),
        { duration: 6000 }
      );
      break;
    case "error":
      toast.custom(
        (t) => (
          <div
            className={classNames(
              "animate-fade-in-up mb-2 flex h-9 items-center space-x-2 rounded-md bg-red-100 p-3 text-sm font-semibold text-red-900 shadow-md",
              t.visible && "animate-fade-in-up"
            )}
          >
            <FiInfo className="h-4 w-4" />
            <p>{message}</p>
          </div>
        ),
        { duration: 6000 }
      );
      break;
    case "warning":
      toast.custom(
        (t) => (
          <div
            className={classNames(
              "animate-fade-in-up mb-2 flex h-9 items-center space-x-2 rounded-md bg-yellow-500 p-3 text-sm font-semibold text-white shadow-md",
              t.visible && "animate-fade-in-up"
            )}
          >
            <FiInfo className="h-4 w-4" />
            <p>{message}</p>
          </div>
        ),
        { duration: 6000 }
      );
      break;
    default:
      toast.custom(
        (t) => (
          <div
            className={classNames(
              "animate-fade-in-up mb-2 flex h-9 items-center space-x-2 rounded-md bg-blue-500 p-3 text-sm font-semibold text-white shadow-md",
              t.visible && "animate-fade-in-up"
            )}
          >
            <FiCheck className="h-4 w-4" />
            <p>{message}</p>
          </div>
        ),
        { duration: 6000 }
      );
      break;
  }
}
