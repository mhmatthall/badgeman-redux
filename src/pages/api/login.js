export default async function handler(req, res) {
  // Guard: invalid method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Guard: invalid body
  if (!req.body) {
    return res.status(400).json({ message: "Invalid request" });
  }

  // Guard: invalid code format
  if (!/^[0-9a-fA-F]{4}$/.test(req.body)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  //debug
  console.log(`Received badge ID: ${req.body}`);

  res.status(200).json({ status: "ok" });
}
