import clientPromise from "@/lib/db/mongodb";

// Wrap an API route handler to give it access to the badges collection
export function withBadges(handler) {
  return async (req, res) => {
    const client = await clientPromise;
    const badges = await client.db("badgeman").collection("badges");

    return handler(req, res, badges);
  };
}
