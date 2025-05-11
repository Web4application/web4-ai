export const notifyUser = (message: string) => {
  new Notification("Web4AI Assistant", { body: message });
};

export const requestNotificationPermission = async () => {
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
};
