// POST /api/badges : Create a new badge in DB
// GET /api/badges : Get all badges from DB
// GET /api/badges/:id : Get a specific badge from DB

// Path: src/pages/api/badges/index.js
import { withSessionRoute } from "@/lib/auth/withSession";
import { getAllBadges } from "@/lib/db/badgesCrud";
import { withBadges } from "@/lib/db/withBadges";

export default withSessionRoute(withBadges(handler));

async function handler(req, res, badges) {
  if (req.method === "GET") {
    const result = await getAllBadges(badges);
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Uh-oh, badge not found. Speak to Matt for help!" });
    } else {
      return res.status(200).json(result);
    }
  }
}
