// Simple in-memory store for preview codes
const previewStore = new Map<string, string>()

export function savePreview(slug: string, code: string) {
  previewStore.set(slug, code)
}

export function getPreview(slug: string): string | undefined {
  return previewStore.get(slug)
}
