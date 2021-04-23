/** @return {{ id: string }} */
export function useParams() {
  const match = window.location.hash.match(
    /\/reports\/custom-report\/([a-zA-Z0-9]+)/
  );
  if (match && match[1]) return { id: match[1] };
  return { id: '' };
}
