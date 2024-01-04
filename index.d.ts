declare global {
  interface Window {
    umami?: {
      track: (event_name: string, event_data?: object) => void
    }
  }
}

export { }
