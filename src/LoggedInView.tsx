import { Box, Button, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import { getPodUrlAll } from "@inrupt/solid-client";
import handleLogOut from "./utils/handleLogOut";
import handleCreatePod from "./utils/handleCreatePod";

function LoggedInView() {
  const { session } = useSession();
  const [pods, setPods] = useState<string[]>([]);

  const getPods = async () => {
    if (session.info.webId) {
      const podUrls = await getPodUrlAll(session.info.webId);
      setPods(podUrls);
    }
  };

  useEffect(() => {
    getPods();
  }, [session]);

  const listPods = () => {
    return pods.map((pod) => {
      return <Typography key={pod}>{pod}</Typography>;
    });
  };

  const renderPodText = () => {
    if (!pods || pods.length === 0)
      return (
        <Typography variant="h3">
          There was an error fetching your Pods
        </Typography>
      );
    if (pods.length === 1) {
      return (
        <>
          <br />
          <Typography
            display="inline"
            variant="h3"
          >{`Your Pod is: `}</Typography>
          <Typography display="inline">{`${pods[0]}`}</Typography>
        </>
      );
    }
    return (
      <>
        <br />
        <Typography variant="h3">Your Pods are: </Typography>
        {listPods()}
      </>
    );
  };

  return (
    <Grid2 container direction="column" spacing={4}>
      <Typography display="inline" variant="h3">{`Your WebID is: `}</Typography>
      <Typography display="inline">{`${session.info.webId}`}</Typography>
      {renderPodText()}
      <Button
        onClick={() => {
          handleCreatePod();
          getPods();
        }}
        variant="contained"
        fullWidth
      >
        Add a Pod and save to your Profile
      </Button>
      <Box sx={{ height: "5px" }} />
      <Button onClick={handleLogOut} variant="contained" fullWidth>
        Logout
      </Button>
    </Grid2>
  );
}

export default LoggedInView;
