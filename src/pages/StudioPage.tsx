import { Studio } from "sanity";
import { Helmet } from "react-helmet-async";
import config from "../../sanity.config";

/**
 * Embedded Sanity Studio at /studio.
 * Sanity handles its own auth — visitors must log in with a Sanity account
 * that has access to project 8326wvly.
 */
export default function StudioPage() {
  return (
    <>
      <Helmet>
        <title>Studio · Charl's Flowers</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div style={{ height: "100vh", width: "100vw" }}>
        <Studio config={config} />
      </div>
    </>
  );
}