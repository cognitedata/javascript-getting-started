import React, { Component } from 'react';
import { ClientSDKProvider, TenantSelector } from '@cognite/gearbox';
import 'antd/dist/antd.css';
import './App.css';
import { CogniteClient, isLoginPopupWindow, loginPopupHandler, POPUP } from '@cognite/sdk';
import Layout from './Layout';

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
      <div className="tenant-selector-container">
        <TenantSelector
          title="Charting App"
          initialTenant="publicdata"
          onTenantSelected={this.onTenantSelected}
        />
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
