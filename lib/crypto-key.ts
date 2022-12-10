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
