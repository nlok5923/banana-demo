import React, { useState, useEffect } from "react";
import "./Home.css";
import { Layout, Space, Button, AutoComplete, Modal, Row, Col } from "antd";
import WalletModal from "../Shared/Modal/Modal";
import { Banana } from "@rize-labs/banana-wallet-sdk/dist/BananaProvider";
import { Chains } from "@rize-labs/banana-wallet-sdk/dist/Constants";
import Loader from "../Shared/Loader/Loader";

const { Header, Footer, Sider, Content } = Layout;

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "#f3f3f3",
  color: "#000000",
  fontSize: "18px",
};

const contentStyle = {
  textAlign: "center",
  minHeight: 865,
  lineHeight: "35px",
  color: "#fff",
  backgroundColor: "#F5C14B",
};

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#f3f3f3",
  color: "#000000",
};

const Home = () => {
  const [isShowWalletModal, setIsShowWalletModal] = useState(false);
  const [isWalletDeployed, setIsWalletDeployed] = useState(false);
  const [bananaWalletInstance, setBananaWalletInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const bananaInstance = new Banana(
      Chains.goerli,
      "https://eth-goerli.g.alchemy.com/v2/V5p1PckEwUqIq5s5rA2zvwRKH0V9Hslr"
    );
    setBananaWalletInstance(bananaInstance);
  }, []);

  const buttonStyle = {
    textAlign: "center",
    minHeight: 100,
    height: "100%",
    minWidth: 100,
    width: "20%",
    marginTop: "21%",
    lineHeight: "120px",
    color: "#fff",
    backgroundColor: "#F5C14B",
    display: isWalletDeployed ? "none" : "normal",
    marginLeft: '40%'
  };

  const showWalletModal = () => {
    setIsShowWalletModal(true);
  };

  const setModalStatus = (status) => {
    setIsShowWalletModal(status);
  };

  return (
    <div className="container">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Layout>
          <Header style={headerStyle}>Welcome to Banana Wallet! 🚀</Header>
          {/* <Loader isLoading={isLoading} > */}
            <Content style={contentStyle}>
              {isWalletDeployed && (
                <button className="wallet-address-btn">
                  SCW: 0xA8458B544c551Af2ADE164C427a8A4F13A346F2A
                </button>
              )}

              {isWalletDeployed && (
                <div className="staking">
                  <div className="staking-instructions">
                    <h1 className="staking-instructions-heading">
                      {" "}
                      Instructions{" "}
                    </h1>
                    <ul>
                      <li> Staking serves a similar function to mining, </li>
                      <li>
                        Cryptocurrencies are typically decentralized, meaning
                        there is no central authority running the show.
                      </li>
                      <li>
                        The network chooses validators (as they’re usually
                        known) based on the size of their stake and the length
                        of time{" "}
                      </li>
                      <li>
                        We are the best staker and most trusted staking app in
                        the market.
                      </li>

                      <li>
                        Cryptocurrencies are typically decentralized, meaning
                        there is no central authority running the show.
                      </li>
                      <li>
                        The network chooses validators (as they’re usually
                        known) based on the size of their stake and the length
                        of time{" "}
                      </li>
                      <li>
                        We are the best staker and most trusted staking app in
                        the market.
                      </li>
                    </ul>
                  </div>
                  <div className="staking-inputs">
                    <input
                      placeholder="Enter amount to stake"
                      className="stake-input-field"
                    />
                    <br />
                    <button className="stake-btn">Stake</button>
                  </div>
                </div>
              )}

              <Content style={buttonStyle}>
                {!isWalletDeployed && (
                  <>
                    <button
                      className="wallet-btn"
                      onClick={() => showWalletModal()}
                    >
                      {" "}
                      🍌 Initialize Wallet{" "}
                    </button>

                    <WalletModal
                      isModalOpen={isShowWalletModal}
                      setModalStatus={(status) => setModalStatus(status)}
                    />
                  </>
                )}
              </Content>
            </Content>
            <Footer style={footerStyle}>Made with ❤️ by rizelabs</Footer>
          {/* </Loader> */}
        </Layout>
      </Space>
    </div>
  );
};

export default Home;
