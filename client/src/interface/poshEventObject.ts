export interface PoshEventObject {
  _id: string
  name: string
  flyer: string
  groupAvi: string
  timezone: string
  startUtc: Date
  endUtc: Date
  url: string
  venueName: string
  groupName: string
  location: {
    coordinates: number[] // ? Check this data type
    type: string
  }
}
