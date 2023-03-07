import { fetch } from "@inrupt/solid-client-authn-browser";
import { getPodUrlAll } from "@inrupt/solid-client";

const OIDC_ISSUER = process.env.REACT_APP_OIDC_ISSUER;
if (!OIDC_ISSUER) {
  throw new Error(
    `Missing OIDC_ISSUER. OIDC_ISSUER environment variable must be set.`
  );
}

const ESS_DOMAIN = process.env.REACT_APP_ESS_DOMAIN;
if (!ESS_DOMAIN) {
  throw new Error(
    `Missing ESS_DOMAIN. ESS_DOMAIN environment variable must be set.`
  );
}

type ProvisionResponse = {
  "@context": {
    id: string;
    profile: {
      "@id": string;
      "@type": string;
    };
    storage: {
      "@id": string;
      "@type": string;
    };
  };
  id: string;
  profile: string;
  storage: string;
};

const doesUserHaveWebIdProfile = (webId: string): Promise<boolean> => {
  return window.fetch(webId, { method: "GET" }).then((res) => res.ok);
};

const createWebIdProfile = async (webId: string): Promise<void> => {
  return fetch(webId, {
    method: "POST",
  }).then((res) => undefined);
};

const doesUserHavePod = async (webId: string): Promise<boolean> => {
  const podURLs = await getPodUrlAll(webId, { fetch });
  return podURLs.length !== 0;
};

const createPod = (): Promise<ProvisionResponse> => {
  return fetch(`https://provision.${ESS_DOMAIN}/`, {
    method: "POST",
  }).then((response) => response.json());
};

const savePodAddressToWebIdProfile = async (
  provisionedPod: ProvisionResponse
): Promise<Response> => {
  return fetch(`${provisionedPod.id}/provision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(provisionedPod),
  });
};

const newUserSetup = async (webId: string): Promise<string> => {
  if (webId) {
    const hasWebIdProfile = await doesUserHaveWebIdProfile(webId);
    if (!hasWebIdProfile) {
      await createWebIdProfile(webId);
    }
    const hasPod = await doesUserHavePod(webId);
    if (!hasPod) {
      const provisionedPod = await createPod();
      if (provisionedPod) {
        await savePodAddressToWebIdProfile(provisionedPod);
      }
    }
  }
  return webId;
};

export default newUserSetup;
