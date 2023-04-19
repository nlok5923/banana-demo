import React, { useState, useEffect } from "react";
import "./Home.css";
import { Layout, Space, Button, AutoComplete, Modal, Row, Col } from "antd";
import WalletModal from "../Shared/Modal/Modal";
import { Banana, Chains } from "@rize-labs/banana-wallet-sdk";
import Loader from "../Shared/Loader/Loader";
import toast, { Toaster } from "react-hot-toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa";
import { FaLink, FaBug } from "react-icons/fa"
import { Signer, ethers } from "ethers";
import StakingArtifact from "../abi/Staking.json";
import BananaToken from "../abi/BananaToken.json";
import Axios from "axios";
import InstructionsModal from "../Shared/InstructionsModal/InstructionsModal";
import SuccessModal from "../Shared/FeedbackModal/SuccessModal/SuccessModal";
import FaliureModal from "../Shared/FeedbackModal/FailureModal/FaliureModal";
import { Network, Alchemy } from "alchemy-sdk";

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
  const [failModalStatus, setFailModalStatus] = useState(false);
  const [successModalStatus, setSuccessModalStatus] = useState(false);
  const [wallet, setWallet] = useState(null);

  const stakeAddress = "0x1CA35dB18E7f594864b703107FeaE4a24974FCb5";
  // const PRIVATE_KEY_EXPOSED ="a66cf2b4bad26d3c10c0d6fc748f91f3fda596db7b6bc289c38bb3d3ff711e74";
  // const PUBLIC_KEY_EXPOSED = "0x3e60B11022238Af208D4FAEe9192dAEE46D225a6";
  const PRIVATE_KEY_EXPOSED =
   process.env.REACT_APP_PRIVATE_KEY;
  const PUBLIC_KEY_EXPOSED = "0x8eDddFA5DB1A5901E17E823Af29501741ab2b024";
  const bananaAddress = "0x4ccE86ebeAf7c764E71aDCd80DBDA1C1c55133Bb";
  const POLYGON_MUMBAI_PREFIX = 'https://mumbai.polygonscan.com/address/';
  const settings = {
    apiKey: "cNkdRWeB8oylSQJSA2V3Xev2PYh5YGr4", // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.
  };
  const alchemy = new Alchemy(settings);

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
      // setFailModalStatus(true);
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

  const setFaliureModalStatus = (status) => {
    setFailModalStatus(status);
  }

  const txnSuccessModalStatus = (status) => {
    setSuccessModalStatus(status)
  }

  useEffect(() => {
    const bananaInstance = new Banana(
      Chains.mumbai,
      // "https://polygon-mumbai.g.alchemy.com/v2/cNkdRWeB8oylSQJSA2V3Xev2PYh5YGr4"
    );
    setBananaWalletInstance(bananaInstance);
    // checkUsersDeviceCompatibility();
  }, []);

  const buttonStyle = {
    textAlign: "center",
    minHeight: 100,
    height: "100%",
    minWidth: 100,
    width: "100%",
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
        const walletInstance = await bananaWalletInstance.connectWallet(walletName);
        setWallet(walletInstance);

        const address = await walletInstance.getAddress();
        console.log("SCW: ", address);
        setWalletAddress(address);
        setIsWalletDeployed(true);
        setIsLoading(false);
        toast.success("Successfully Connected Wallet!");
      } catch(err) {
        toast("Something crashed!! While connecting");
        // setFailModalStatus(true);
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

    await createWallet();
    // setIsShowWalletModal(true);
  };

  const createWallet = async () => {

    setLoadingMessage("Creating your wallet...");
    setIsLoading(true);

    // const isWalletNameUnique = await bananaWalletInstance.isWalletNameUnique(walletName);
    // if(!isWalletNameUnique) {
    //     toast.error("Wallet name already taken please enter different wallet name");
    //     setIsLoading(false);
    //     setFailModalStatus(true);
    //     return 
    // }

    try {
        const walletInstance = await bananaWalletInstance.createWallet();
        setWallet(walletInstance);
        const address = await walletInstance.getAddress();

        console.log("SCW: ", address);
        setWalletAddress(address);
        setIsLoading(false);
        setIsWalletDeployed(true);
        toast.success("Successfully Created Wallet!");
        await prefundWallet(address);
    } catch (err) {
        setIsShowWalletModal(false);
        setIsLoading(false);
        setIsWalletDeployed(false);
        toast("Currently this device is not supported!");
        // setFailModalStatus(true)
        console.log(err);
    }
  };

  const setModalStatus = (status) => {
    setIsShowWalletModal(status);
  };

  const getWalletBalance =  async (walletAddress) => {
    const userBalance = await alchemy.core.getBalance(walletAddress, "latest")
    return parseInt(userBalance._hex, 16) / 10 ** 18;
  }

  const stakeAfterAuth = async () => {
    setLoadingMessage("Minting Airdrop...");
    setIsLoading(true);

    // checking user wallet balance will fund it in case the wallet has no balance 
    const userBalance = await getWalletBalance(walletAddress);

    if(userBalance < 0.05) {
      toast("Wallet balance is low! Funding it");
      await prefundWallet(walletAddress);
    }

    setLoadingMessage("Minting Airdrop...");
    setIsLoading(true);

    let bananaSigner = await wallet.getSigner();
    let bananContract = new ethers.Contract(
      bananaAddress,
      BananaToken.abi,
      bananaSigner
    );
    const mintingCallData = bananContract.interface.encodeFunctionData("mint", [
      walletAddress,
    ]);
    try {
        // const txn = await bananaWalletInstance.execute(
        //     mintingCallData,
        //     bananaAddress,
        //     "0"
        // );
        const tx1 = {
          gasLimit: '0x55555',
          to: bananaAddress,
          value: 0,
          data: mintingCallData
        }

        let txn = await bananaSigner.sendTransaction(tx1);

        console.log(txn);
        setIsTransactionDone(true);
        toast.success("Successfully Claimed 100 BNT Tokens!!");
        setIsLoading(false);
        setSuccessModalStatus(true);
    } catch (err) {
        setIsTransactionDone(false);
        toast("Your new wallet is ready! Please refresh");
        setIsLoading(false);
        // setFailModalStatus(true);
        console.log(err);
    }
  };

  return (
    <div className="container">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Layout>
          <Header style={headerStyle}>
            Welcome to Banana Wallet SDK 
          </Header>
          <Toaster />
          <Loader isLoading={isLoading} message={loadingMessage}>
            <Content style={contentStyle}>
              {isWalletDeployed && (
                <button className="wallet-address-btn">
                  Wallet Address: {walletAddress.substring(0,5) + "..." + walletAddress.substring(38,42)}
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
                <FaliureModal
                  isModalOpen={failModalStatus}
                  setModalStatus={(status) => setFaliureModalStatus(status)}
                />
                <SuccessModal
                  isModalOpen={successModalStatus}
                  setModalStatus={(status) => txnSuccessModalStatus(status)}
                />
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
