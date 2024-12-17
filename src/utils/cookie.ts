export function getCookieValue(cookieName: string) {
  if (typeof window === "undefined" || !window.document.cookie) {
    return null;
  }
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${cookieName}=`));
  return cookie ? cookie.split("=")[1] : null;
}
