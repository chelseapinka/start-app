import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { ReactElement, useEffect, useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import { ILoginInputOptions } from "@inrupt/solid-client-authn-core";
import { getPodUrlAll } from "@inrupt/solid-client";

const OIDC_ISSUER = process.env.REACT_APP_OIDC_ISSUER;
if (!OIDC_ISSUER) {
  throw new Error(
    `Missing OIDC_ISSUER. OIDC_ISSUER environment variable must be set.`
  );
}

function LeftPanel() {
  const { session } = useSession();
  const [idpsFromWebIdProfile, setIdpsFromWebIdProfile] = useState<string[]>(
    []
  );
  const [webId, setWebId] = useState("");
  const [loginWithWebId, setLoginWithWebID] = useState<boolean>(false);
  const [pods, setPods] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("en");
  const doesUserHaveWebIdProfile = async (): Promise<boolean> => {
    return window.fetch(webId, { method: "GET" }).then((res) => res.ok);
  };
  const getIdpFromWebId = async () => {
    const listOfIdps: string[] = [];

    if (await doesUserHaveWebIdProfile()) {
    }
    setLoginWithWebID(true);
    setIdpsFromWebIdProfile(listOfIdps);
  };

  useEffect(() => {
    const { isLoggedIn, webId } = session.info;
    if (isLoggedIn) {
      const getPods = async () => {
        if (webId) {
          const podUrls = await getPodUrlAll(webId);
          setPods(podUrls);
        }
      };
      getPods();
    }
  }, [session]);

  const renderIdpOptions = () => {
    if (idpsFromWebIdProfile.length) {
      let buttons: ReactElement[] = idpsFromWebIdProfile.map((idp) => {
        return (
          <Button
            onClick={() => handleLogin(OIDC_ISSUER)}
            variant="contained"
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

  const RadioButtonsGroup = () => {
    return (
      <FormControl>
        <FormLabel id="radio-buttons-language">Language</FormLabel>
        <RadioGroup
          aria-labelledby="radio-buttons-language"
          name="radio-buttons-group"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <FormControlLabel value="en" control={<Radio />} label="English" />
          <FormControlLabel value="es" control={<Radio />} label="Español" />
        </RadioGroup>
      </FormControl>
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

  const handleCreatePod = async () => {
    console.log("create a pod!");
  };

  const listPods = () => {
    return pods.map((pod) => {
      return <Typography>{pod}</Typography>;
    });
  };

  return (
    <Box width={"50%"}>
      <Grid2 container direction="column" spacing={4}>
        <Grid2>
          <img src="inrupt-logo.png" alt="inrupt logo" />
          <RadioButtonsGroup />
          <Typography variant="h1">Experience Solid</Typography>
          <Typography variant="h3">
            Inrupt PodSpaces allows Solid developers to create and test apps
            against Inrupt's Enterprise Solid Server.
          </Typography>
          <Typography>
            While this service is in Developer Preview, do not use it to run
            applications in production. Do not store sensitive or personal data
            in this Developer Preview service.
          </Typography>
          <Typography>
            Otherwise, have fun, leave feedback, and share with the community.
          </Typography>
        </Grid2>
        <Box>
          {session.info.isLoggedIn ? (
            <>
              <Typography
                display="inline"
                variant="h3"
              >{`Your WebID is: `}</Typography>
              <Typography display="inline">{`${session.info.webId}`}</Typography>
              {pods.length > 1 ? (
                <>
                  <Typography variant="h3">Your Pods are: </Typography>
                  {listPods()}
                </>
              ) : (
                <>
                  <Typography
                    display="inline"
                    variant="h3"
                  >{`Your Pod is: `}</Typography>
                  <Typography display="inline">{`${pods[0]}`}</Typography>
                </>
              )}
              <Button onClick={handleCreatePod} variant="contained" fullWidth>
                Add a Pod and save to your Profile
              </Button>
              <Box sx={{ height: "5px" }} />
              <Button onClick={handleLogOut} variant="contained" fullWidth>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Typography>Have a WebID? </Typography>
              <Button
                onClick={() => handleLogin("https://login.inrupt.com")}
                variant="contained"
              >
                Sign In with PodSpaces
              </Button>
              <Typography>
                Or enter your WebID to Sign into another server
              </Typography>
              <TextField
                variant="standard"
                onChange={(e) => setWebId(e.target.value)}
                value={webId}
              />

              <Button onClick={getIdpFromWebId} variant="contained">
                Get IDP from WebID Profile
              </Button>
              {renderIdpOptions()}
            </>
          )}
        </Box>
      </Grid2>
    </Box>
  );
}

export default LeftPanel;
