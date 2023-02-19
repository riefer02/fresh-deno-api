// A legacy iteration, I was trying to create a crypto key and make it secure. 
// I think this approach is compromisable because the key just sits in the /app folder,
// I chose to manually generate the key and store it in an env variable

const keyExists = await Deno.readTextFile(".jwk");

if (!keyExists) {
  const cryptoKey = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );

  const exportedKey = await crypto.subtle.exportKey("jwk", cryptoKey);

  await Deno.writeTextFile(".jwk", JSON.stringify(exportedKey));
}
