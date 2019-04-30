import React from "react";
import { AssetTree, TimeseriesSearch } from "@cognite/gearbox";
import * as sdk from "@cognite/sdk";
import styled from "styled-components";
import { Button, message, notification } from "antd";

const ButtonGroup = Button.Group;

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
    assetsFetched: [],
    assetChecked: null,
    timeseriesChecked: []
  };

  async componentDidMount() {
    const listAssets = await sdk.Assets.list();

    this.setState({
      assetsFetched: listAssets.items
    });
  }

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
    const changes = this.state.timeseriesChecked.map(elem => {
      return { id: elem, assetId: { set: this.state.assetChecked } };
    });

    if (changes.length) {
      await sdk.TimeSeries.updateMultiple(changes);

      //User actions feedback info
      const seriesString = this.state.timeseriesChecked.join(", ");
      notification.open({
        message: "Successfully connected",
        description: `Asset: ${
          this.state.assetChecked
        } was connected to TimeSeries: ${seriesString}`,
        duration: 3
      });
    } else {
      //User actions feedback info
      message.info("Nothing to connect");
    }
  };

  render() {
    const { assetsFetched } = this.state;
    const filterRule = timeseries => !timeseries.assetId;

    return (
      <PageContainer>
        <PageAssets>
          <AssetTree assets={assetsFetched} onSelect={this.handleAssetSelect} />
        </PageAssets>
        <PageSeries>
          <TimeseriesSearch
            onTimeserieSelectionChange={this.handleSeriesSelect}
            filterRule={filterRule}
          />
        </PageSeries>
        <PageButtons>
          <ButtonGroup>
            <Button type="primary" onClick={this.handleSeriesConnect}>
              Connect
            </Button>
          </ButtonGroup>
        </PageButtons>
      </PageContainer>
    );
  }
}

export default TimeseriesContainer;
