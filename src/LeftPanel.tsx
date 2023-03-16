import {
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
  const [textDataset, setTextDataset] = useState<SolidDataset | undefined>();
  const [string1Thing, setString1Thing] = useState<Thing | undefined | null>();
  const [string2Thing, setString2Thing] = useState<Thing | undefined | null>();
  const [string3Thing, setString3Thing] = useState<Thing | undefined | null>();
  const [string4Thing, setString4Thing] = useState<Thing | undefined | null>();
  const [string1Text, setString1Text] = useState<string | null>("");
  const [string2Text, setString2Text] = useState<string | null>("");
  const [string3Text, setString3Text] = useState<string | null>("");
  const [string4Text, setString4Text] = useState<string | null>("");

  const getTextDatasetAndThing = async () => {
    const text = await getSolidDataset(textRdfDocumentUrl, {
      fetch: session.fetch,
    });
    setTextDataset(text);
  };

  const getPods = async () => {
    if (session.info.webId) {
      const podUrls = await getPodUrlAll(session.info.webId);
      setPods(podUrls);
    }
  };

  useEffect(() => {
    getPods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    getTextDatasetAndThing();
  }, []);

  useEffect(() => {
    if (textDataset) {
      setString1Thing(getThing(textDataset, string1RdfThingUrl));
      setString2Thing(getThing(textDataset, string2RdfThingUrl));
      setString3Thing(getThing(textDataset, string3RdfThingUrl));
      setString4Thing(getThing(textDataset, string4RdfThingUrl));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textDataset]);

  useEffect(() => {
    if (string1Thing && string2Thing && string3Thing && string4Thing) {
      setString1Text(
        getStringWithLocale(string1Thing, appTextPredicate, language)
      );
      setString2Text(
        getStringWithLocale(string2Thing, appTextPredicate, language)
      );
      setString3Text(
        getStringWithLocale(string3Thing, appTextPredicate, language)
      );
      setString4Text(
        getStringWithLocale(string4Thing, appTextPredicate, language)
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [string1Thing, string2Thing, string3Thing, string4Thing, language]);

  const RadioButtonsGroup = () => {
    return (
      <FormControl>
        <FormLabel id="radio-buttons-language">Choose your language</FormLabel>
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
    // <Box display="flex">
    <Grid2
      container
      direction="column"
      spacing={4}
      className="Left panel Grid container"
    >
      <Grid2 className="left-panel-always">
        <Grid2 container>
          <Grid2 flexGrow="1">
            <img src="inrupt-logo.png" alt="inrupt logo" />
          </Grid2>
          <Grid2>
            <RadioButtonsGroup />
          </Grid2>
        </Grid2>
        {string1Text && string2Text && string3Text && string4Text ? (
          <Grid2 container spacing={4}>
            <Grid2>
              <Typography variant="h1">{string1Text}</Typography>
            </Grid2>
            <Grid2>
              <Typography variant="h3">{string2Text}</Typography>
            </Grid2>
            <Grid2>
              <Typography variant="h3">{string3Text}</Typography>
            </Grid2>
            <Grid2>
              <Typography variant="h3">{string4Text}</Typography>
            </Grid2>
          </Grid2>
        ) : (
          <Grid2 container spacing={4}>
            <Grid2>
              <Typography variant="h1">{defaultStrings.string1}</Typography>
            </Grid2>
            <Grid2>
              <Typography variant="h3">{defaultStrings.string2}</Typography>
            </Grid2>
            <Grid2>
              <Typography variant="h3">{defaultStrings.string3}</Typography>
            </Grid2>
            <Grid2>
              <Typography variant="h3">{defaultStrings.string4}</Typography>
            </Grid2>
          </Grid2>
        )}
      </Grid2>
      <Grid2 container>
        {session.info.isLoggedIn ? (
          <Grid2>
            <LoggedInView />
          </Grid2>
        ) : (
          <Grid2>
            <LoggedOutView />
          </Grid2>
        )}
      </Grid2>
    </Grid2>
  );
}

export default LeftPanel;
