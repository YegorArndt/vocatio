import { type LsNotification, getPersistedState } from "./ls";

export const createNotification = (n: LsNotification) => {
  const persistedState = getPersistedState();
  const { notifications } = persistedState;
  // updatePersistedState({
  //   notifications: [...notifications, n],
  // });
  // document.createEvent(lsUpdateEvent);

  return n;
};
