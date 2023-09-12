import { verify } from "@/lib/secret";

export default async function handler(req, res) {
  const { body } = req;

  // Guard: invalid method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Guard: invalid body
  if (!body || !body.badgeId || !body.verificationCode) {
    return res.status(400).json({ message: "Invalid request" });
  }

  // Guard: invalid badge ID format
  if (!/^[0-9]+$/.test(body.badgeId)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  // Guard: invalid verification code format
  if (!/^[0-9a-fA-F]{4}$/.test(body.verificationCode)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  // Guard: invalid badge ID (not found in DB)
  // TODO: replace this with a real database query
  if (body.badgeId !== "1234") {
    return res
      .status(404)
      .json({ message: "Uh-oh, badge not found. Speak to Matt for help!" });
  }

  // Guard: invalid verification code
  if (!verify(body.badgeId, body.verificationCode)) {
    return res
      .status(400)
      .json({ message: "That's not the right code. Please try again." });
  }

  console.log(
    `Successful ${req.method} at /login -- id: ${body.badgeId} code: ${body.verificationCode}`
  );

  // Successful request
  return res.status(200).json({ message: "Login successful" });
}
