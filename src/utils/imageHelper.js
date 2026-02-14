const BASE_URL = "https://bec-frontend-matrimony-api.3t5o2t.easypanel.host";

export const getImageUrl = (filename) => {
  if (!filename) return null;

  const cleanFilename = filename.trim(); // 🔥 removes \n, spaces
  return `${BASE_URL}/uploads/photos/${encodeURIComponent(cleanFilename)}`;
};

