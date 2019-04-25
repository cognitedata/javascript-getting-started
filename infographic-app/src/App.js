import React, { Component } from "react";
import { TenantSelector } from "@cognite/gearbox";
import * as sdk from "@cognite/sdk";
import Layout from "./Layout";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    const search = window.location.search.replace("?", "");
    this.state = {
      tenant: search || null,
      isAuthorized: false
    };
  }

  async componentDidMount() {
    if (this.state.tenant) {
      await this.authenticate(this.state.tenant);
      this.setState({ isAuthorized: true });
    }
    // this required to make possible navigation back to login page
    window.onpopstate = async event => {
      if (!event.state || !event.state.tenant) {
        this.setState({
          tenant: null,
          isAuthorized: false
        });
      }
    };
  }

  authenticate = async tenant => {
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
  };

  onTenantSelected = async tenant => {
    await this.authenticate(tenant);

    this.setState({ tenant, isAuthorized: true });
    // direct change of location.search causes re-render and loosing state
    window.history.pushState({ tenant }, "", `/?${tenant}`);
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
