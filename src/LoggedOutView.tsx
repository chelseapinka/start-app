import { Button, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { ReactElement, useEffect, useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import { ILoginInputOptions } from "@inrupt/solid-client-authn-core";
import { getThing, getWebIdDataset, getUrlAll } from "@inrupt/solid-client";
import { SOLID } from "@inrupt/vocab-solid";

const OIDC_ISSUER = process.env.REACT_APP_OIDC_ISSUER;
if (!OIDC_ISSUER) {
  throw new Error(
    `Missing OIDC_ISSUER. OIDC_ISSUER environment variable must be set.`
  );
}

function LoggedOutView() {
  const { session } = useSession();
  const [idpsFromWebIdProfile, setIdpsFromWebIdProfile] = useState<string[]>(
    []
  );
  const [webId, setWebId] = useState("");
  const [loginWithWebId, setLoginWithWebID] = useState<boolean>(false);

  const doesUserHaveWebIdProfile = async (): Promise<boolean> => {
    return window.fetch(webId, { method: "GET" }).then((res) => res.ok);
  };

  const getIdpsFromWebId = async () => {
    try {
      if (await doesUserHaveWebIdProfile()) {
        const profile = await getWebIdDataset(webId);
        if (profile) {
          const webIdThing = getThing(profile, webId);
          if (webIdThing !== null) {
            const listOfIdps = getUrlAll(webIdThing, SOLID.oidcIssuer);
            setLoginWithWebID(true);
            setIdpsFromWebIdProfile(listOfIdps);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderIdpOptions = () => {
    if (idpsFromWebIdProfile.length) {
      let buttons: ReactElement[] = idpsFromWebIdProfile.map((idp) => {
        return (
          <Button
            onClick={() => handleLogin(idp)}
            variant="contained"
            key={idp}
          >{`Login with ${idp}`}</Button>
        );
      });
      return <div>{buttons}</div>;
    }

    if (loginWithWebId && !idpsFromWebIdProfile.length)
      return (
        <Typography>
          There was an error discovering the IDP associated with this WebID.
        </Typography>
      );
  };

  const handleLogin = async (
    oidcIssuer: string | undefined = process.env.REACT_APP_OIDC_ISSUER,
    redirectUrl: string | undefined = window.location.href
  ) => {
    const config: ILoginInputOptions = {
      clientId: process.env.REACT_APP_CLIENT_ID,
      clientName: "Start App",
      oidcIssuer,
      redirectUrl,
    };
    await session.login(config);
  };

  return (
    <Grid2 container direction="column" spacing={4}>
      <Typography>Have a WebID? </Typography>
      <Button
        onClick={() => handleLogin("https://login.inrupt.com")}
        variant="contained"
      >
        Sign In with PodSpaces
      </Button>
      <Typography>Or enter your WebID to Sign into another server</Typography>
      <TextField
        variant="standard"
        onChange={(e) => setWebId(e.target.value)}
        value={webId}
      />

      <Button onClick={getIdpsFromWebId} variant="contained">
        Get IDP from WebID Profile
      </Button>
      {renderIdpOptions()}
    </Grid2>
  );
}

export default LoggedOutView;
