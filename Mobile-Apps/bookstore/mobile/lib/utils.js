export function formatMemberSince(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return "Unknown date";
  }

  const options = { year: "numeric", month: "long" };
  return date.toLocaleDateString(undefined, options); // e.g. "May 2025"
}



export function formatPublishDate(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", {month: "long"});
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}