import { Button, notification } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { AssetSearch, AssetScanner, Model3DViewer } from '@cognite/gearbox';

const Wrapper = styled('div')`
  display: flex;
  position: fixed;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

const Header = styled('div')`
  display: flex;
  padding: 10px;
  background-color: blue;
  position: relative;
  z-index: 1;
`;

const Body = styled('div')`
  padding: 10px;
  position: relative;
  flex: 1;
  display: flex;
  z-index: 0;

  > div {
    height: 100% !important;
    width: 100% !important;
  }
`;

const SearchWrapper = styled('div')`
  display: flex;
  flex: 1;
`;

const ActionsWrapper = styled('div')`
  flex: 0;
  margin-left: 5px;
`;

export class Layout extends React.Component {
  cache = {};
  state = {
    asset: null,
    modelID: null,
    revisionID: null,
  };

  async componentDidMount() {
    const { client } = this.props;
    const models = await client.models3D.list().autoPagingToArray();

    if (!models.length) {
      notification.error({
        description: 'Your Tenant doesn\'t have any models',
        message: 'Fail fetch models list',
      });

      return;
    }

    const { id: modelID } = models[0];
    const revisions = await client.revisions3D.list(modelID).autoPagingToArray();

    if (!revisions.length) {
      notification.error({
        description: 'Model has no revisions',
        message: 'Fail fetch revisions list',
      });

      return;
    }

    const { id: revisionID } = revisions[0];

    this.setState({ modelID, revisionID });
  }

  onLiveSearchSelect = async asset => {
    this.setState({ asset });
  };

  reset = () => this.setState({ asset: null });

  render() {
    const { asset, modelID, revisionID } = this.state;

    return (
      <Wrapper>
        <Header>
          <SearchWrapper>
            <AssetSearch onLiveSearchSelect={this.onLiveSearchSelect} />
          </SearchWrapper>
          <ActionsWrapper>
            <Button disabled={!asset} onClick={this.reset}>
              Scanner
            </Button>
          </ActionsWrapper>
        </Header>
        <Body>
          {asset && modelID && revisionID ? (
            <Model3DViewer
              modelId={modelID}
              revisionId={revisionID}
              assetId={asset.id}
              cache={this.cache}
            />
          ) : (
            <AssetScanner />
          )}
        </Body>
      </Wrapper>
    );
  }
}
