import React from "react";
import { CogniteClient } from "@cognite/sdk";
import { ClientSDKProvider } from "@cognite/gearbox";
import Explorer from "./Explorer";
import "antd/dist/antd.css";

const APP_ID = "hello-cdf-gearboxjs";
const PROJECT_ID = "publicdata";

const App = () => {

  const [client, setClient] = React.useState(null)

  const auth = async (client) => {
    await client.authenticate();
    setClient(client);
  }

  React.useEffect(() => {
    const client = new CogniteClient({
      appId: APP_ID
    });

    client.loginWithOAuth({ project: PROJECT_ID });
    auth(client);
  }, [])

  return (
      <div>
        {client && (
          <ClientSDKProvider client={client}>
            <Explorer />
          </ClientSDKProvider>
        )}
        {!client && <div>Please wait ...</div>}
      </div>
    );
}

export default App;
