import React, { Component } from "react";
import { TenantSelector } from "@cognite/gearbox";
import * as sdk from "@cognite/sdk";
import Layout from "./Layout";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isAuthorized: false
    };
  }

  onTenantSelected = async tenant => {
    if (sdk.Login.isPopupWindow()) {
      sdk.Login.popupHandler();
      return;
    }

    await sdk.Login.authorize({
      popup: true,
      project: tenant,
      redirectUrl: window.location.href,
      errorRedirectUrl: window.location.href
    });

    this.setState({ isAuthorized: true });
  };

  render() {
    return this.state.isAuthorized ? (
      <Layout />
    ) : (
      <div className="login-page-container">
        <div className="login-container">
          <TenantSelector
            title="Infographic App"
            initialTenant="publicdata"
            onTenantSelected={this.onTenantSelected}
          />
        </div>
      </div>
    );
  }
}

export default App;
