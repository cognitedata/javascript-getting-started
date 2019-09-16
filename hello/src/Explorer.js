import React from "react";
import { AssetTree, AssetMeta } from "@cognite/gearbox";
import { Button } from "antd";
import { Col, Row, Layout } from "antd";
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
          <Row>
            <Col span={18}>
              {this.state.isTreeVisible
                ? "All assets"
                : `Asset #${this.state.selectedAssetID}`}
            </Col>
            <Col span={6}>
              {!this.state.isTreeVisible && (
                <Button
                  type="danger"
                  onClick={() => this.setState({ isTreeVisible: true })}
                >
                  Back
                </Button>
              )}
            </Col>
          </Row>
        </Header>
        <Content style={{ padding: "10px" }}>
          {this.state.isTreeVisible && (
            <AssetTree
              onSelect={asset => {
                console.log(`AssetTree: selected ${asset.key}`);
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
