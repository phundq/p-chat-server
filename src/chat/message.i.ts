export interface Messenger {
  senderId: number,
  receiveId: number,
  room: string,
  messenger: string
  time: Date,
}