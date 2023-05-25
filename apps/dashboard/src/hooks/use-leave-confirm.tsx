import { type FieldValues, type FormState } from "react-hook-form";

type Props<T extends FieldValues> = {
  formState: FormState<T>;
  message?: string;
};

const defaultMessage = "Are you sure to leave without saving?";

export function useLeaveConfirm<T extends FieldValues>({
  formState: _1,
  message: _2 = defaultMessage,
}: Props<T>) {
  // const Router = useRouter();
  // const { isDirty } = formState;
  // const onRouteChangeStart = useCallback(() => {
  //   if (isDirty) {
  //     if (window.confirm(message)) {
  //       return true;
  //     }
  //     throw "Abort route change by user's confirmation.";
  //   }
  // }, [isDirty, message]);
  // useEffect(() => {
  //   Router.events.on("routeChangeStart", onRouteChangeStart);
  //   return () => {
  //     Router.events.off("routeChangeStart", onRouteChangeStart);
  //   };
  // }, [Router.events, onRouteChangeStart]);
  // useBeforeunload((event) => {
  //   if (isDirty) {
  //     event.preventDefault();
  //   }
  // });
}

export function LeaveConfirm<T extends FieldValues>(props: Props<T>) {
  useLeaveConfirm(props);
  return null;
}
