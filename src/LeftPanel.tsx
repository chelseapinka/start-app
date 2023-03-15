import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";

import {
  getPodUrlAll,
  getStringWithLocale,
  getThing,
  getSolidDataset,
  Thing,
  SolidDataset,
} from "@inrupt/solid-client";
import defaultStrings from "./defaultStrings.json";
// import strings from "./stringsDataset.ttl";
import LoggedInView from "./LoggedInView";
import LoggedOutView from "./LoggedOutView";

const OIDC_ISSUER = process.env.REACT_APP_OIDC_ISSUER;
if (!OIDC_ISSUER) {
  throw new Error(
    `Missing OIDC_ISSUER. OIDC_ISSUER environment variable must be set.`
  );
}

const appTextPredicate = "http://www.w3.org/2007/ont/http#Message";
const textRdfDocumentUrl =
  "https://storage.inrupt.com/d0f9cb3c-2187-4363-86f2-30944951f5ec/languages";
const string1RdfThingUrl =
  "https://storage.inrupt.com/d0f9cb3c-2187-4363-86f2-30944951f5ec/#string1";
const string2RdfThingUrl =
  "https://storage.inrupt.com/d0f9cb3c-2187-4363-86f2-30944951f5ec/languages#string2";
const string3RdfThingUrl =
  "https://storage.inrupt.com/d0f9cb3c-2187-4363-86f2-30944951f5ec/languages#string3";
const string4RdfThingUrl =
  "https://storage.inrupt.com/d0f9cb3c-2187-4363-86f2-30944951f5ec/languages#string4";

function LeftPanel() {
  const { session } = useSession();
  const [pods, setPods] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("en-us");
  // const [textDataset, setTextDataset] = useState<SolidDataset | undefined>();
  // const [string1Thing, setString1Thing] = useState<Thing | undefined | null>();
  // const [string2Thing, setString2Thing] = useState<Thing | undefined | null>();
  // const [string3Thing, setString3Thing] = useState<Thing | undefined | null>();
  // const [string4Thing, setString4Thing] = useState<Thing | undefined | null>();
  let textDataset: SolidDataset | undefined;
  let string1Thing: Thing | undefined | null;
  let string2Thing: Thing | undefined | null;
  let string3Thing: Thing | undefined | null;
  let string4Thing: Thing | undefined | null;

  const getTextDatasetAndThing = async () => {
    textDataset = await getSolidDataset(textRdfDocumentUrl, {
      fetch: session.fetch,
    });
  };

  getTextDatasetAndThing();
  if (textDataset) {
    string1Thing = getThing(textDataset, string1RdfThingUrl);
    string2Thing = getThing(textDataset, string2RdfThingUrl);
    string3Thing = getThing(textDataset, string3RdfThingUrl);
    string4Thing = getThing(textDataset, string4RdfThingUrl);
  }

  const getPods = async () => {
    if (session.info.webId) {
      const podUrls = await getPodUrlAll(session.info.webId);
      setPods(podUrls);
    }
  };

  useEffect(() => {
    getPods();
  }, [session]);

  useEffect(() => {
    if (string1Thing && string2Thing && string3Thing && string4Thing) {
      getStringWithLocale(string1Thing, appTextPredicate, language);
      getStringWithLocale(string2Thing, appTextPredicate, language);
      getStringWithLocale(string3Thing, appTextPredicate, language);
      getStringWithLocale(string4Thing, appTextPredicate, language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

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
          <FormControlLabel value="en-us" control={<Radio />} label="English" />
          <FormControlLabel value="es-es" control={<Radio />} label="Español" />
        </RadioGroup>
      </FormControl>
    );
  };

  return (
    <Box width={"50%"}>
      <Grid2 container direction="column" spacing={4}>
        <Grid2>
          <img src="inrupt-logo.png" alt="inrupt logo" />
          <RadioButtonsGroup />

          {string1Thing && string2Thing && string3Thing && string4Thing ? (
            <>
              <Typography variant="h1">
                {getStringWithLocale(string1Thing, appTextPredicate, language)}
              </Typography>
              <Typography variant="h3">
                {getStringWithLocale(string2Thing, appTextPredicate, language)}
              </Typography>
              <Typography variant="h3">
                {getStringWithLocale(string3Thing, appTextPredicate, language)}
              </Typography>
              <Typography variant="h3">
                {getStringWithLocale(string4Thing, appTextPredicate, language)}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h1">{defaultStrings.string1}</Typography>
              <Typography variant="h3">{defaultStrings.string2}</Typography>
              <Typography variant="h3">{defaultStrings.string3}</Typography>
              <Typography variant="h3">{defaultStrings.string4}</Typography>
            </>
          )}
        </Grid2>
        <Box>
          {session.info.isLoggedIn ? <LoggedInView /> : <LoggedOutView />}
        </Box>
      </Grid2>
    </Box>
  );
}

export default LeftPanel;
