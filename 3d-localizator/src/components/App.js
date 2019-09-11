import React from 'react';
import styled from 'styled-components';
import { ClientSDKProvider, TenantSelector } from '@cognite/gearbox';
import { CogniteClient, isLoginPopupWindow, loginPopupHandler, POPUP } from '@cognite/sdk';
import { Layout } from './Layout';

const LoginWrapper = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 50px 0 0;

  > * {
    width: 400px;
  }
`;

class App extends React.Component {
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
      <LoginWrapper>
        <TenantSelector
          header={'Type tenant name'}
          title="3D Localizator"
          initialTenant="publicdata"
          onTenantSelected={this.onTenantSelected}
        />
      </LoginWrapper>
    );
  }

  render() {
    const isLoggedIn = this.state.tenant !== null;
    return (
      <ClientSDKProvider client={this.client}>
        {isLoggedIn ? <Layout client={this.client}/> : this.renderLoginScreen()}
      </ClientSDKProvider>
    );
  }
}

export default App;
