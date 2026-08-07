const LEGACY_DICEBEAR = /^https:\/\/avatars\.dicebear\.com\/api\/([^/]+)\/(.+)\.svg$/

export const avatarSrc = (avatar: string | null | undefined) =>
  avatar?.replace(LEGACY_DICEBEAR, 'https://api.dicebear.com/9.x/$1/svg?seed=$2')
