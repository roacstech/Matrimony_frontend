const BASE_URL = `${import.meta.env.VITE_APP_API_URL}`;

export const getImageUrl = (filename) => {
  if (!filename) return null;

  const cleanFilename = filename.trim(); // 🔥 removes \n, spaces
  return `${BASE_URL}/uploads/photos/${encodeURIComponent(cleanFilename)}`;
};

