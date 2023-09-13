import { withSessionRoute } from "@/lib/auth/withSession";
import { createBadgeByMac, findBadgebyMac } from "@/lib/db/badgesCrud";
import { withBadges } from "@/lib/db/withBadges";

export default withSessionRoute(withBadges(handler));

async function handler(req, res, badges) {
  const { body } = req;
  const { mac } = req.query;

  // Guard: badges collection not found
  if (!badges) {
    return res.status(500).json({ message: "Internal server error" });
  }

  // Guard: invalid badge ID format
  if (!/^[0-9A-F]{12}$/.test(mac)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  // Successful receipt
  console.log(
    `Successful ${req.method} at /badges/by-mac/${mac} -- body: ${body}`
  );

  // GET: Get badge by MAC address
  if (req.method === "GET") {
    const badge = await findBadgebyMac(badges, mac);
    if (!badge) {
      return res
        .status(404)
        .json({ message: "Uh-oh, badge not found. Speak to Matt for help!" });
    } else {
      return res.status(200).json(badge[0]);
    }
  }

  // POST: Create new badge (sent only by badge device)
  if (req.method === "POST") {
    if (!mac) return res.status(400).json({ message: "Invalid request" });

    const result = await createBadgeByMac(badges, mac);

    console.log("RESULT:", result);
    return res.status(201).json("Badge created successfully");
  }

  // PUT: N/A
  if (req.method === "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // DELETE: N/A
  if (req.method === "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // If we get here, a mysterious error has occurred
  return res.status(500).json({ message: "Internal server error" });
}
