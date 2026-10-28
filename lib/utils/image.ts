export function cleanImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmedUrl = url.trim();

  // 1. Jika user copas link halaman Unsplash (contoh: unsplash.com/photos/ID)
  if (trimmedUrl.includes("unsplash.com/photos/")) {
    const photoId = trimmedUrl.split("-").pop()?.split("?")[0];
    if (photoId) {
      return `https://images.unsplash.com/photo-${photoId}?w=800&auto=format&fit=crop`;
    }
  }

  // 2. Jika user copas link Pinterest / Imgur / Postimg dll. (bisa ditambahkan aturan lain)

  return trimmedUrl;
}