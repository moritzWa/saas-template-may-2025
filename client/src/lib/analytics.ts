// Analytics stub - replace with your analytics provider (e.g., Posthog, Mixpanel, etc.)

export function track(_event: string, _properties?: Record<string, unknown>) {
  // TODO: Implement analytics tracking
  // Example with Posthog:
  // posthog.capture(event, properties)
}

export function trackDownloadIntent(_location: string) {
  track('download_intent', { location: _location });
}

export function trackDownloadStart(_platform: string, _location: string) {
  track('download_start', { platform: _platform, location: _location });
}
