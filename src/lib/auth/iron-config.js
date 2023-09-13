export const ironOptions = {
  cookieName: "BADGEMAN_SESSION",
  password: process.env.BADGEMAN_SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
