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
import { FaLink } from "react-icons/fa"
import { ethers } from "ethers";
import StakingArtifact from "../abi/Staking.json";
import BananaToken from "../abi/BananaToken.json";
import Axios from "axios";
import InstructionsModal from "../Shared/InstructionsModal/InstructionsModal";

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
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isTransactionDone, setIsTransactionDone] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const stakeAddress = "0x1CA35dB18E7f594864b703107FeaE4a24974FCb5";
  const PRIVATE_KEY_EXPOSED =
   process.env.REACT_APP_PRIVATE_KEY;
  const PUBLIC_KEY_EXPOSED = "0x8eDddFA5DB1A5901E17E823Af29501741ab2b024";
  const bananaAddress = "0x4ccE86ebeAf7c764E71aDCd80DBDA1C1c55133Bb";
  const POLYGON_MUMBAI_PREFIX = 'https://mumbai.polygonscan.com/address/';

  const prefundWallet = async (receiver) => {
    try {
      const fundTxn = {
        from: PUBLIC_KEY_EXPOSED,
        to: receiver,
        value: ethers.utils.parseEther("0.1"),
        gasLimit: 210000,
      };
      toast.success("Wait we are prefunding your wallet");
      setLoadingMessage("Hold on! Funding your wallet...");
      setIsLoading(true);
      const wallet = new ethers.Wallet(
        PRIVATE_KEY_EXPOSED,
        new ethers.providers.JsonRpcProvider(
          "https://polygon-mumbai.g.alchemy.com/v2/cNkdRWeB8oylSQJSA2V3Xev2PYh5YGr4"
        )
      );
      const txn = await wallet.sendTransaction(fundTxn);
      await txn.wait();
      console.log(txn);
      toast.success("Prefunded wallet with 0.1 MATIC");
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false)
      toast.error("Wallet prefund crashed !!");
      console.log(err);
    }
  };

  const cancelWalletDeployment = () => {
    setIsLoading(false);
    setIsWalletDeployed(false);
    setIsInstructionModalOpen(false);
    setIsShowWalletModal(false);
    setModalStatus(false)
  }

  const checkUsersDeviceCompatibility = async () => {
    let isPlatformSupport = true;
    // eslint-disable-next-line no-undef
    if(PublicKeyCredential) {
    // eslint-disable-next-line no-undef
        isPlatformSupport = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
    return isPlatformSupport;
  }

  const setInstructionModalFun = (status) => {
    setIsInstructionModalOpen(status);
  }

  useEffect(() => {
    const bananaInstance = new Banana(
      Chains.mumbai,
      "https://polygon-mumbai.g.alchemy.com/v2/cNkdRWeB8oylSQJSA2V3Xev2PYh5YGr4"
    );
    setBananaWalletInstance(bananaInstance);
    // checkUsersDeviceCompatibility();
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
    // marginLeft: "42%",
    margin: 'auto'
  };

  const initWallet = async () => {
    const walletName = bananaWalletInstance.getWalletName();
    console.log("Wallet Name: ", walletName);
    if (walletName) {
      setLoadingMessage("Connecting your wallet...");
      setIsLoading(true);
      try {
        const address = await bananaWalletInstance.getWalletAddress(walletName);
        console.log("SCW: ", address);
        setWalletAddress(address);
        setIsWalletDeployed(true);
        setIsLoading(false);
        toast.success("Successfully Connected Wallet!");
      } catch(err) {
        toast.error("Something crashed!!");
        setIsLoading(false);
        setIsWalletDeployed(false);
        console.log(err);
      }
      return;
    }

    const isPlatformSupport = await checkUsersDeviceCompatibility();

    if(!isPlatformSupport) {
        setIsInstructionModalOpen(true);
    }
    setIsShowWalletModal(true);
  };

  const createWallet = async (walletName) => {

    setLoadingMessage("Creating your wallet...");
    setIsLoading(true);

    const isWalletNameUnique = await bananaWalletInstance.isWalletNameUnique(walletName);
    if(!isWalletNameUnique) {
        toast.error("Wallet name already taken please enter different wallet name");
        setIsLoading(false);
        return 
    }

    try {
        const address = await bananaWalletInstance.getWalletAddress(walletName);
        console.log("SCW: ", address);
        setWalletAddress(address);
        setIsShowWalletModal(false);
        setIsLoading(false);
        setIsWalletDeployed(true);
        toast.success("Successfully Created Wallet!");
        prefundWallet(address);
    } catch (err) {
        setIsShowWalletModal(false);
        setIsLoading(false);
        setIsWalletDeployed(false);
        toast.error("Something crashed !!");
        console.log(err);
    }
  };

  const setModalStatus = (status) => {
    setIsShowWalletModal(status);
  };

  const stakeAfterAuth = async () => {
    setLoadingMessage("Minting Airdrop...");
    setIsLoading(true);
    const metaDataUri = {
      name: "Banana Wallet Token",
      image:
        "https://bafybeibo77zyzq5c5joyrer75j6pwbc2ux5yfll27r5ssclkgfj2f4ngi4.ipfs.w3s.link/banana-dozen.jpeg",
      description:
        "Represents you had successfully made transactions using Banana Wallet",
    };
    let aaProvider = await bananaWalletInstance.getAAProvider();
    console.log("AA Provider", aaProvider);
    let aaSigner = aaProvider.getSigner();
    let bananContract = new ethers.Contract(
      bananaAddress,
      BananaToken.abi,
      aaSigner
    );
    const mintingCallData = bananContract.interface.encodeFunctionData("mint", [
      walletAddress,
    ]);
    try {
        const txn = await bananaWalletInstance.execute(
            mintingCallData,
            bananaAddress,
            "0"
        );
        console.log(txn);
        setIsTransactionDone(true);
        toast.success("Successfully Claimed 100 BNT Tokens!!");
        setIsLoading(false);
    } catch (err) {
        setIsTransactionDone(false);
        toast.error("Something crashed while executing txn !!");
        setIsLoading(false);
        console.log(err);
    }
  };

  return (
    <div className="container">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Layout>
          <Header style={headerStyle}>Welcome to Banana Wallet SDK 🚀</Header>
          <Toaster />
          <Loader isLoading={isLoading} message={loadingMessage}>
            <Content style={contentStyle}>
              {isWalletDeployed && (
                <button className="wallet-address-btn">
                  Address: {walletAddress}
                  <a href={POLYGON_MUMBAI_PREFIX + walletAddress} rel="noreferrer" target={"_blank"} className='lp-footer-links-li'>
                    <FaLink style={{ marginLeft: "10px" }} />
                    </a>
                </button>
              )}
              {isWalletDeployed && (
                <div className="staking">
                  <h1 className="staking-instructions-heading">
                    Hurry! Get your Banana Airdrop!
                  </h1>
                  {isTransactionDone && <button className="txn-address-btn">
                  <a href={POLYGON_MUMBAI_PREFIX + walletAddress + "#tokentxns"} rel="noreferrer" target={"_blank"} className='lp-footer-links-li'>View on Explorer</a>
                </button> }
                  <img
                    className="nft-image"
                    src="images/banana-dozen.jpeg"
                    alt="Banana NFT"
                  />
                  <button
                    className="stake-btn"
                    onClick={() => stakeAfterAuth()}
                  >
                    Claim Free Airdrop
                  </button>
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
                    
                    <InstructionsModal
                    instructionModalStatus={isInstructionModalOpen}
                    instructionModalFun = {(status) => setInstructionModalFun(status)}
                    cancelCreation = {() => cancelWalletDeployment()}
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
