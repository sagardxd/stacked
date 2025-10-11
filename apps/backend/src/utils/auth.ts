import crypto from "crypto";

export function buildAuthMessage({
  domain = "localhost",
  walletPubkey,
  statement = "Sign in to Stakex - no funds will be moved.",
  uri,
  version = "1",
  nonce,
  issuedAtISO,
  expiryISO
}: {
  domain: string;
  walletPubkey: string;
  statement?: string;
  uri: string;
  version?: string;
  nonce: string;
  issuedAtISO: string;
  expiryISO: string;
}): string {
  return [
    `domain: ${domain}`,
    `address: ${walletPubkey}`,
    `statement: ${statement}`,
    `uri: ${uri}`,
    `version: ${version}`,
    `nonce: ${nonce}`,
    `issuedAt: ${issuedAtISO}`,
    `expiry: ${expiryISO}`
  ].join("\n");
}


export function makeNonce() {
  return crypto.randomBytes(16).toString("hex");
}
