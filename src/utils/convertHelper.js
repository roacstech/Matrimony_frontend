// src/utils/enumHelper.js
import { storevalues } from "../constants/storevalues";

/**
 * Convert DB value → UI label
 */
export const getEnumLabel = (type, value, mode = "tamil") => {
  return storevalues[type]?.[value]?.[mode] || value || "-";
};

/**
 * Get select options (for dropdowns)
 */
export const getEnumOptions = (type, mode = "both") => {
  const options = storevalues[type] || {};
  return Object.entries(options).map(([key, labels]) => ({
    value: key,
    label: labels[mode],
  }));
};