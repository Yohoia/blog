// Same UUID/Base62 mapping as PageHush's shared article-address module.
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const maxId = 1n << 128n;

export function articleShortId(id: string): string {
  if (!uuidPattern.test(id)) throw new Error("Invalid PageHush article UUID");
  let value = BigInt(`0x${id.replaceAll("-", "")}`);
  let result = "";
  do {
    result = alphabet[Number(value % 62n)] + result;
    value /= 62n;
  } while (value);
  return result.padStart(22, "0");
}

export function articleIdFromShortId(id: string): string | null {
  if (!/^[0-9A-Za-z]{22}$/.test(id)) return null;
  let value = 0n;
  for (const character of id)
    value = value * 62n + BigInt(alphabet.indexOf(character));
  if (value >= maxId) return null;
  const hex = value.toString(16).padStart(32, "0");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
