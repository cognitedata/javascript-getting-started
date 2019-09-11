import React from 'react';
import { ClientSDKProvider, TenantSelector } from '@cognite/gearbox';
import { CogniteClient, isLoginPopupWindow, loginPopupHandler, POPUP } from '@cognite/sdk';
import TimeseriesContainer from '../../containers/TimeseriesContainer/TimeseriesContainer';
import styled from 'styled-components';
import 'antd/dist/antd.css';

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TenantSelectorContainer = styled.div`
  max-width: 600px;
  min-width: 400px;
`;

class TimeseriesConnector extends React.Component {
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
      <TenantSelectorContainer>
        <TenantSelector
          title="Timeseries Connector"
          initialTenant="publicdata"
          onTenantSelected={this.onTenantSelected}
        />
      </TenantSelectorContainer>
    );
  }

  render() {
    const isLoggedIn = this.state.tenant !== null;
    return (
      <ClientSDKProvider client={this.client}>
        <PageContainer>
          {isLoggedIn ? <TimeseriesContainer client={this.client}/> : this.renderLoginScreen()}
        </PageContainer>
      </ClientSDKProvider>
    );
  }
}

export default TimeseriesConnector;
