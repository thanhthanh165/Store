const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "784111210562-4r267lej393cop44tp55omic0a8tvjbr.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "api/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, callback) {
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
