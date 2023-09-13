import { withSessionRoute } from "@/lib/auth/withSession";
import { findBadgebyId, updateBadgebyId } from "@/lib/db/badgesCrud";
import { withBadges } from "@/lib/db/withBadges";
import { generateCompleteBadge } from "@/lib/gfx/image";

export default withSessionRoute(withBadges(handler));

async function handler(req, res, badges) {
  const { body } = req;
  const { badgeId } = req.query;

  // Guard: badges collection not found
  if (!badges) {
    return res.status(500).json({ message: "Internal server error" });
  }

  // Guard: invalid badge ID format
  if (!/^[0-9]+$/.test(badgeId)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  // Successful receipt
  console.log(
    `Successful ${req.method} at /badges/${badgeId} -- body: ${body}`
  );

  // GET: Get badge by ID
  if (req.method === "GET") {
    const badge = await findBadgebyId(badges, badgeId);
    if (!badge) {
      return res
        .status(404)
        .json({ message: "Uh-oh, badge not found. Speak to Matt for help!" });
    } else {
      return res.status(200).json(badge[0]);
    }
  }

  // POST: N/A
  if (req.method === "POST") {
    return res.status(400).json({ message: "Invalid request" });
  }

  // PUT: Update badge by ID
  if (req.method === "PUT") {
    if (!body) return res.status(400).json({ message: "Invalid request" });

    // Generate new badge image
    body.image = await generateCompleteBadge(body);

    // Update DB
    const result = await updateBadgebyId(badges, badgeId, body);

    // Verify that the badge was updated
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Uh-oh, badge not found. Speak to Matt for help!" });
    } else {
      return res.status(200).json({ message: "Badge updated successfully" });
    }
  }

  // DELETE: Delete badge by ID
  if (req.method === "DELETE") {
    return res.status(500).json({ message: "TODO" });
  }

  // If we get here, a mysterious error has occurred
  return res.status(500).json({ message: "Internal server error" });
}
