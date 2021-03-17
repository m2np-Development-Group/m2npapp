import { Button, Notification } from "@abbychau/svelma";

export const Alert = (message,type) => {
  Notification.create({
    message: message,
    type: type
  })
}
export const Warning = (message) => {
    Alert(message,"is-warning");
}