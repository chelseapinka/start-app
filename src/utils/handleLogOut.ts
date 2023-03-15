const OIDC_ISSUER = process.env.REACT_APP_OIDC_ISSUER;
if (!OIDC_ISSUER) {
  throw new Error(
    `Missing OIDC_ISSUER. OIDC_ISSUER environment variable must be set.`
  );
}

const handleLogOut = async () => {
  const discoveryEndpoint = new URL(
    "/.well-known/openid-configuration",
    // not-null assertion because error gets thrown above if OIDC_ISSUER is undefined
    OIDC_ISSUER!
  );
  try {
    const response = await fetch(discoveryEndpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const responseJson = await response.json();
    window.location = responseJson.end_session_endpoint;
  } catch (error) {
    alert(error);
  }
};

export default handleLogOut;
