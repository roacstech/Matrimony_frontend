const BASE_URL = "http://localhost:5000";

export const getImageUrl = (filename) => {
  if (!filename) return null;

  const cleanFilename = filename.trim(); // 🔥 removes \n, spaces
  return `${BASE_URL}/uploads/photos/${encodeURIComponent(cleanFilename)}`;
};

