"use client";

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from "react";

import { type Notification } from "~/lib/shared/api/notifications";

type NotificationsContext = {
  notifications: Notification[];
  unreadCount: number;
};

type Props = {
  value: NotificationsContext;
} & PropsWithChildren;

export enum NotificationActionTypes {
  ADD_NOTIFICATION = "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION",
  MARK_AS_READ = "MARK_AS_READ",
}

type NotificationsAction = {
  type: NotificationActionTypes;
  payload: Notification;
};

const notificationsContext = createContext<NotificationsContext>({
  notifications: [],
  unreadCount: 0,
});

const notificationsDispatchContext = createContext<
  Dispatch<NotificationsAction>
>(null!);

const notificationsReducer = (
  state: NotificationsContext,
  action: NotificationsAction,
) => {
  const { type, payload } = action;

  switch (type) {
    case NotificationActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case NotificationActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== payload.id,
        ),
        unreadCount: state.unreadCount - 1,
      };
    case NotificationActionTypes.MARK_AS_READ:
      return {
        ...state,
        unreadCount: state.unreadCount - 1,
      };
    default:
      return state;
  }
};

export function NotificationsProvider({ value, children }: Props) {
  const [notifications, dispatch] = useReducer(notificationsReducer, value);

  return (
    <notificationsContext.Provider value={notifications}>
      <notificationsDispatchContext.Provider value={dispatch}>
        {children}
      </notificationsDispatchContext.Provider>
    </notificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(notificationsContext);
}

export function useNotificationsDispatch() {
  return useContext(notificationsDispatchContext);
}
