export const createBasicAuthToken = (u: string, p: string) => {
  const base64Token = Buffer.from(`${u}:${p}`).toString("base64");
  return `Basic ${base64Token}`;
};
