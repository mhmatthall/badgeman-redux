import { withSessionRoute } from "@/lib/auth/withSession";

export default withSessionRoute(logout);

async function logout(req, res) {
  // Remove authenticated session
  req.session.destroy();

  // Tell the frontend that we're logged out (cookie removed)
  return res.status(200).json({ message: "Logout successful" });
}
