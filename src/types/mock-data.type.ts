export type MockData = {
  names: string[],
  descriptions: string[],
  previewImages: string[],
  images: string[],
  coordinates: {
    latitude: number[],
    longitude: number[]
  },
  users: {
    usernames: string[],
    avatars: string[],
    emails: string[],
    passwords: string[]
  }
}
