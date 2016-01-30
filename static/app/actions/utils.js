export function checkStatus (response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}
