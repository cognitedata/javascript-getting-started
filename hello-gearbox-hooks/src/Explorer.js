import React from "react";
import { AssetTree, AssetMeta } from "@cognite/gearbox";
import { Button, Icon, Layout } from "antd";
import "antd/dist/antd.css";

const { Header, Footer, Content } = Layout;

const Explorer = () => {

  const initialState = {
    selectedAssetID: null,
    isTreeVisible: true
  };

  const [explorerState, setExplorerState] = React.useState(initialState)

  return (
    <Layout>
      <Header style={{ color: "white", fontSize: "1.4em" }}>
        {!explorerState.isTreeVisible && (
          <Button
            type="danger"
            onClick={() => setExplorerState({ isTreeVisible: true })}
          >
            <Icon type="left" />
            Back
            </Button>
        )}
        {explorerState.isTreeVisible
          ? "All assets"
          : `  Asset #${explorerState.selectedAssetID}`}
      </Header>
      <Content style={{ padding: "10px" }}>
        <div style={{ display: explorerState.isTreeVisible ? "block" : "none" }}>
          <AssetTree
            onSelect={asset => {
              setExplorerState({
                selectedAssetID: asset.key,
                isTreeVisible: false
              });
            }}
          />
        </div>

        <div style={{ display: explorerState.isTreeVisible ? "none" : "block" }}>
          <AssetMeta assetId={explorerState.selectedAssetID} />
        </div>
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

export default Explorer;
