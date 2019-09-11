import React from 'react';
import { AssetTree, TimeseriesSearch } from '@cognite/gearbox';
import styled from 'styled-components';
import { Button, message, notification } from 'antd';

const PageContainer = styled.div`
  width: 90vw;
  height: 80vh;
  display: flex;
  justify-content: left;
`;

const PageAssets = styled.div`
  width: 40%;
`;

const PageSeries = styled.div`
  width: 45%;
`;

const PageButtons = styled.div`
  width: 15%;
  padding: 0 0 0 5px;
`;

class TimeseriesContainer extends React.Component {
  state = {
    assetChecked: null,
    timeseriesChecked: []
  };

  handleAssetSelect = data => {
    //User actions feedback info
    console.log(`Asset checked: ${data.title}`);

    this.setState({
      assetChecked: data.key
    });
  };

  handleSeriesSelect = timeseriesChecked => {
    this.setState({
      timeseriesChecked
    });
  };

  handleSeriesConnect = async () => {
    const changes = this.state.timeseriesChecked.map(id => {
      return {
        id,
        update: {
          assetId: {
            set: this.state.assetChecked,
          },
        },
      };
    });

    if (changes.length) {
      await this.props.client.timeseries.update(changes);

      //User actions feedback info
      const seriesString = this.state.timeseriesChecked.join(', ');
      notification.open({
        message: 'Successfully connected',
        description: `Asset: ${
          this.state.assetChecked
        } was connected to Timeseries: ${seriesString}`,
        duration: 3
      });
    } else {
      //User actions feedback info
      message.info('Nothing to connect');
    }
  };

  render() {
    const filterRule = timeseries => !timeseries.assetId;

    return (
      <PageContainer>
        <PageAssets>
          <AssetTree onSelect={this.handleAssetSelect} />
        </PageAssets>
        <PageSeries>
          <TimeseriesSearch
            onTimeserieSelectionChange={this.handleSeriesSelect}
            filterRule={filterRule}
          />
        </PageSeries>
        <PageButtons>
          <Button type='primary' onClick={this.handleSeriesConnect}>
            Connect
          </Button>
        </PageButtons>
      </PageContainer>
    );
  }
}

export default TimeseriesContainer;
