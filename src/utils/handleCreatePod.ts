import { fetch } from "@inrupt/solid-client-authn-browser";

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

const handleCreatePod = async (): Promise<ProvisionResponse> => {
  const provisionedPod = await createPod();
  if (provisionedPod) {
    await savePodAddressToWebIdProfile(provisionedPod);
  }
  return provisionedPod;
};

export default handleCreatePod;
