export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // spaces → -
    .replace(/[^\w\-]+/g, "")    // remove special chars
    .replace(/\-\-+/g, "-");     // multiple - → single
};