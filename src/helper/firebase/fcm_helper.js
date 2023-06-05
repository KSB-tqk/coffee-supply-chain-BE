import admin from "./firebase_helper.js";

export async function pushNotification(
  token,
  notificationTitle,
  notificationMessage
) {
  const message = {
    notification: {
      title: notificationTitle,
      body: notificationMessage,
    },
    token: token,
  };

  console.log("message", message);

  // Send a message to the device corresponding to the provided
  // registration token.
  const response = await admin.messaging().send(message);
  return response;
}

export async function pushNotificationToTopic(
  topic,
  notificationTitle,
  notificationMessage,
  userId
) {
  const message = {
    data: {
      exceptUserId: userId,
    },
    notification: {
      title: notificationTitle,
      body: notificationMessage,
    },
    topic: topic,
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  const response = await admin.messaging().send(message);
  return response;
}

export async function subscribeToTopic(topic, token) {
  const response = await admin.messaging().subscribeToTopic([token], topic);
  return response;
}

export async function unSubscribeFromTopic(topic, token) {
  const response = await admin.messaging().unsubscribeFromTopic([token], topic);
  return response;
}
