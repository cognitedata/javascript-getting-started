import React, { Component } from "react";
import { TenantSelector } from "@cognite/gearbox";
import Layout from "./Layout";
import { ReactAuthProvider } from "@cognite/react-auth";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      tenant: ''
    };
  }

  onTenantSelected = async tenant => {
    this.setState({ tenant });
  };

  render() {
    return (
      <ReactAuthProvider
        project={this.state.tenant}
        redirectUrl={window.location.href}
        errorRedirectUrl={window.location.href}
        usePopup={true}
        loginRenderer={
          <div className="login-page-container">
            <div className="login-container">
              <TenantSelector
                title="Infographic App"
                initialTenant="publicdata"
                onTenantSelected={this.onTenantSelected}
              />
            </div>
          </div>
        }
      >
        <Layout />
      </ReactAuthProvider>
    );
  }
}

export default App;
