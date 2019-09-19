import React from "react";
import { CogniteClient } from "@cognite/sdk";
import { ClientSDKProvider } from "@cognite/gearbox";
import Explorer from "./Explorer";
import "antd/dist/antd.css";

const APP_ID = "hello-cdf-gearboxjs";
const PROJECT_ID = "publicdata";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      client: null
    };
  }

  async componentDidMount() {
    const client = new CogniteClient({
      appId: APP_ID
    });

    client.loginWithOAuth({ project: PROJECT_ID });
    await client.authenticate();
    this.setState({ client });
  }

  render() {
    return (
      <div>
        {this.state.client && (
          <ClientSDKProvider client={this.state.client}>
            <Explorer />
          </ClientSDKProvider>
        )}

        {!this.state.client && <div>Please wait ...</div>}
      </div>
    );
  }
}

export default App;
