import { Button, Notification } from "svelma";

export const Alert = (message,type) => {
  Notification.create({
    message: message,
    type: type
  })
}
export const Warning = (message) => {
  Alert(message,"is-warning");
}
export const Success = (message) => {
  Alert(message,"is-success");
}