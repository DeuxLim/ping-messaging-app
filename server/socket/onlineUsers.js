// A singleton store for tracking Active users
const onlineUsers = {};

export function addUser(userId, socketId) {
  if (!onlineUsers[userId]) onlineUsers[userId] = [];
  onlineUsers[userId].push(socketId);
}

export function removeUser(userId, socketId) {
  if (!onlineUsers[userId]) return;
  onlineUsers[userId] = onlineUsers[userId].filter(id => id !== socketId);
  if (onlineUsers[userId].length === 0) delete onlineUsers[userId];
}

export function getOnlineUserIds() {
  return Object.keys(onlineUsers);
}

export function isUserOnline(userId) {
  return !!onlineUsers[userId];
}