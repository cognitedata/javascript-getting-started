import React from "react";
import { AssetTree, AssetMeta } from "@cognite/gearbox";
import { Button, Icon, Layout } from "antd";
import "antd/dist/antd.css";

const { Header, Footer, Content } = Layout;

class Explorer extends React.Component {
  state = {
    selectedAssetID: null,
    isTreeVisible: true
  };

  handleAssetSelect(asset) {
    this.setState({ selectedAssetID: asset.key });
  }

  render() {
    return (
      <Layout>
        <Header style={{ color: "white", fontSize: "1.4em" }}>
          {!this.state.isTreeVisible && (
            <Button
              type="danger"
              onClick={() => this.setState({ isTreeVisible: true })}
            >
              <Icon type="left" />
              Back
            </Button>
          )}

          {this.state.isTreeVisible
            ? "All assets"
            : `  Asset #${this.state.selectedAssetID}`}
        </Header>
        <Content style={{ padding: "10px" }}>
          {this.state.isTreeVisible && (
            <AssetTree
              onSelect={asset => {
                this.setState({
                  selectedAssetID: asset.key,
                  isTreeVisible: false
                });
              }}
            />
          )}

          {!this.state.isTreeVisible && (
            <AssetMeta assetId={this.state.selectedAssetID} />
          )}
        </Content>
        <Footer>
          Data from{" "}
          <a href="https://openindustrialdata.com/">
            Open Industrial Data project
          </a>
        </Footer>
      </Layout>
    );
  }
}

export default Explorer;
