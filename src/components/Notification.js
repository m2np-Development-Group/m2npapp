import { getNotificationsContext } from "svelte-notifications";

export const warning = (msg)=> {
    const { addNotification } = getNotificationsContext();
    addNotification({
        text: msg,
        position: "top-right",
        type: "warning",
        removeAfter: 3000,
    });

}