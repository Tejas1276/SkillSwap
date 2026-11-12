const AVATAR_BY_FIRST_NAME = {
  tejas: '/avatars/tejas.svg',
  rohan: '/avatars/rohan.svg',
  priya: '/avatars/priya.svg',
  aman: '/avatars/aman.svg',
  kritika: '/avatars/kritika.svg',
  aditya: '/avatars/aditya.svg',
  arjun: '/avatars/arjun.svg',
  nidhi: '/avatars/nidhi.svg',
  rahul: '/avatars/rahul.svg',
  sarah: '/avatars/sarah.svg',
  marcus: '/avatars/marcus.svg',
  elena: '/avatars/elena.svg',
};

/**
 * Resolves a safe illustrated non-human avatar path.
 * Automatically replaces missing or real-photo URLs (e.g., unsplash) with
 * local stylized mascot avatars.
 */
export const getAvatarSrc = (avatarUrl, name = '') => {
  if (avatarUrl && !avatarUrl.includes('unsplash.com')) {
    return avatarUrl;
  }

  const first = String(name || '').trim().split(/\s+/)[0]?.toLowerCase();
  return AVATAR_BY_FIRST_NAME[first] || '/avatars/default.svg';
};
