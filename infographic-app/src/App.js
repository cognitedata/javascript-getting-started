import React, { Component } from 'react';
import { ClientSDKProvider, TenantSelector } from '@cognite/gearbox';
import { CogniteClient, isLoginPopupWindow, loginPopupHandler, POPUP } from '@cognite/sdk';
import Layout from './Layout';
import './App.css';

class App extends Component {
  state = {
    tenant: null,
  };
  client = new CogniteClient({appId: 'charting-app-example'});

  componentDidMount() {
    if (isLoginPopupWindow()) {
      loginPopupHandler();
      return;
    }
  }

  onTenantSelected = async tenant => {
    this.client.loginWithOAuth({
      project: tenant,
      onAuthenticate: POPUP,
    });
    await this.client.authenticate();
    this.setState({ tenant });
  };

  renderLoginScreen() {
    return (
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

  render() {
    const isLoggedIn = this.state.tenant !== null;
    return (
      <ClientSDKProvider client={this.client}>
        <div className="main-layout">
          {isLoggedIn ? <Layout/> : this.renderLoginScreen()}
        </div>
      </ClientSDKProvider>
    );
  }
}

export default App;
