import React, { useState, useEffect } from "react";
import "./Home.css";
import { Layout, Space, Button, AutoComplete, Modal, Row, Col } from "antd";
import WalletModal from "../Shared/Modal/Modal";
import { Banana } from "@rize-labs/banana-wallet-sdk/dist/BananaProvider";
import { Chains } from "@rize-labs/banana-wallet-sdk/dist/Constants";
import Loader from "../Shared/Loader/Loader";
import toast, { Toaster } from "react-hot-toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa";
import { ethers } from "ethers";
import StakingArtifact from "../abi/Staking.json";

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
  const [walletAddress, setWalletAddress] = useState("");
  const stakeAddress = "0x1CA35dB18E7f594864b703107FeaE4a24974FCb5";
  const PRIVATE_KEY_EXPOSED = '6923720ab043d19f5975644c6312f0de7ffbe7bc446c871abde2c078eaeae53f'
  const PUBLIC_KEY_EXPOSED = '0x0565B4C5c5B01682B99006C48382269938773560'

  const prefundWallet = async (receiver) => {
    try {
      const fundTxn = {
        from: PUBLIC_KEY_EXPOSED,
        to: receiver,
        value: ethers.utils.parseEther("0.01"),
        gasLimit: 210000
      }
      toast.success('Wait we are prefunding your wallet');
      setIsLoading(true);
      const wallet = new ethers.Wallet(PRIVATE_KEY_EXPOSED, new ethers.providers.Web3Provider(window.ethereum));
      const txn = await wallet.sendTransaction(fundTxn);
      await txn.wait()
      console.log(txn);
      toast.success('Prefunded wallet with 0.01 eth');
      setIsLoading(false);
    } catch (err) {
      toast.success('Something crashed');
      console.log(err);
    }
  }

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
    paddingTop: "21%",
    color: "#fff",
    backgroundColor: "#F5C14B",
    display: isWalletDeployed ? "none" : "normal",
    marginLeft: "42%",
  };

  const initWallet = async () => {
    const walletName = bananaWalletInstance.getWalletName();
    console.log("Wallet Name: ", walletName);
    if (walletName) {
      setIsLoading(true);
      const address = await bananaWalletInstance.getWalletAddress(walletName);
      console.log("SCW: ", address);
      setWalletAddress(address);
      setIsWalletDeployed(true);
      setIsLoading(false);
      toast.success("Successfully Initialized Wallet!");
      return;
    }
    setIsShowWalletModal(true);
  };

  const createWallet = async (walletName) => {
    setIsLoading(true);
    const address = await bananaWalletInstance.getWalletAddress(walletName);
    console.log("SCW: ", address);
    setWalletAddress(address);
    setIsShowWalletModal(false);
    setIsLoading(false);
    setIsWalletDeployed(true);
    toast.success("Successfully Initialized Wallet!");
    prefundWallet(address);
  };

  const setModalStatus = (status) => {
    setIsShowWalletModal(status);
  };

  const stakeAfterAuth = async () => {
    setIsLoading(true);
    let aaProvider = await bananaWalletInstance.getAAProvider();
    console.log("AA Provider", aaProvider);
    let aaSigner = aaProvider.getSigner();
    let StakingContract = new ethers.Contract(
      stakeAddress,
      StakingArtifact.abi,
      aaSigner
    );
    const stakingCallData = StakingContract.interface.encodeFunctionData(
      "stake",
      []
    );
    const txn = await bananaWalletInstance.execute(
      stakingCallData,
      stakeAddress,
      "0.0001"
    );
    toast.success("Successfully staked your funds !!");
    setIsLoading(false);
  };

  return (
    <div className="container">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Layout>
          <Header style={headerStyle}>Welcome to Banana Wallet SDK! 🚀</Header>
          <Toaster />
          <Loader isLoading={isLoading}>
            <Content style={contentStyle}>
              {isWalletDeployed && (
                <button className="wallet-address-btn">
                  SCW: {walletAddress}
                  <CopyToClipboard
                    text={walletAddress}
                    onCopy={() => toast.success("Address copied")}
                  >
                    <FaRegCopy style={{ marginLeft: "10px" }} />
                  </CopyToClipboard>
                </button>
              )}
              {isWalletDeployed && (
                <div className="staking">
                  <div className="staking-instructions">
                    <h1 className="staking-instructions-heading">
                      Instructions
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
                    <p className="staking-input-disc">*We had prefunded your wallet to make txn</p>
                    <input
                      placeholder="Enter amount to stake"
                      className="stake-input-field"
                      value={"0.0001"}
                      type="number"
                      readOnly
                    />
                    <br />
                    <button className="stake-btn" onClick={() => stakeAfterAuth()} >Stake</button>
                  </div>
                </div>
              )}

              <Content style={buttonStyle}>
                {!isWalletDeployed && (
                  <>
                    <button className="wallet-btn" onClick={() => initWallet()}>
                      🍌 Get Started
                    </button>

                    <WalletModal
                      isModalOpen={isShowWalletModal}
                      setModalStatus={(status) => setModalStatus(status)}
                      createWallet={(walletName) => createWallet(walletName)}
                    />
                  </>
                )}
              </Content>
            </Content>
            <Footer style={footerStyle}>Made with ❤️ by rizelabs</Footer>
          </Loader>
        </Layout>
      </Space>
    </div>
  );
};

export default Home;
// myWalletDeployer : 0xF248E2ba728Dc6f8143bDC37226A2792e7c4bbc7
// Elliptic : 0x5051B73E8E24a740863f61B6ff1FfB23d26e7A87
// staking : 0x6863F12EA6A16b9ACBd7210ee2CA5C369A9629a0
// entryPoint : 0xb124f5DB610f2aBC9b3A1b4297f9037b6D84A29A