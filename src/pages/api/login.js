import { verify } from "@/lib/auth/secret";
import { withSessionRoute } from "@/lib/auth/withSession";
import { findBadgebyId } from "@/lib/db/badgesCrud";
import { withBadges } from "@/lib/db/withBadges";

export default withSessionRoute(withBadges(handler));

async function handler(req, res, badges) {
  const { body } = req;

  // Guard: badges collection not found
  if (!badges) {
    return res.status(500).json({ message: "Internal server error" });
  }

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
  if (!(await findBadgebyId(badges, body.badgeId))) {
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

  // Successful request
  console.log(
    `Successful ${req.method} at /login -- id: ${body.badgeId} code: ${body.verificationCode}`
  );

  // Store badge ID in session cookie
  req.session.badgeId = body.badgeId;
  await req.session.save();

  // Return success
  return res.status(200).json({ message: "Login successful" });
}
