/**
 * Produces a string hash of the given file
 * @param content the raw content of the file (file.text())
 */
export const hashFile = {
  fromFile: async (file: File) => {
    const buffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(await file.text())
    );
    const hash = Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hash;
  },
  fromBuffer: async (buffer: ArrayBuffer) => {
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hash;
  },
};
