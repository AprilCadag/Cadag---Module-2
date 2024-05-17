import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

const App = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [accountName, setAccountName] = useState("Name");
  const [newName, setNewName] = useState(""); 
  const [showChangeName, setShowChangeName] = useState(false); 

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      getBalance(accounts[0]);
    } else {
      setAccount(null);
      setBalance(null);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        getBalance(accounts[0]);
      } catch (error) {
        console.error("Error connecting to wallet", error);
      }
    } else {
      alert("MetaMask is not installed");
    }
  };

  const getBalance = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    setBalance(ethers.utils.formatEther(balance));
  };

  const depositOneEth = async () => {
    if (!account) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", atm_abi.abi, signer);
  
      const transaction = await signer.sendTransaction({
        to: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        value: ethers.utils.parseEther("1")
      });
      await transaction.wait();
  
      getBalance(account);
    } catch (error) {
      console.error("Error depositing funds:", error);
    }
  };
  
  const withdrawOneEth = async () => {
    if (!account) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", atm_abi.abi, signer);
    
      const transaction = await contract.withdraw(ethers.utils.parseEther("1"));
      await transaction.wait();
    
      getBalance(account);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    }
  };
    

  const handleChangeName = async () => {
    setShowChangeName(true); 
  };

  const handleSubmitName = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", atm_abi.abi, signer);
    try {
      
      const transaction = await contract.setAccountName(newName);
      await transaction.wait();
      
      setAccountName(newName);
     
      setNewName("");
      setShowChangeName(false);
    } catch (error) {
      console.error("Error changing name:", error);
    }
  };

  const styles = {
    walletManager: {
      width: '400px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      backgroundColor: '#FFFEFE',
      textAlign: 'center'
    },
    button: {
      margin: '7px',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#dddddd', 
        color: 'black', 
      }
    },
    buttonPrimary: {
      color: 'black',
      width: '300px',
      borderRadius: '50px',
      border: '2px solid black',
      '&:hover': {
        backgroundColor: '#dddddd', 
        color: 'black', 
      }
    },
    buttonSuccess: {
      backgroundColor: '#FFFFFF',
      color: 'black',
      borderRadius: '50px',
      border: '2px solid black',
      '&:hover': {
        backgroundColor: '#dddddd', 
        color: 'black', 
      }
    },
    buttonWarning: {
      backgroundColor: '#FFFFFF',
      color: 'black',
      borderRadius: '50px',
      border: '2px solid black',
      '&:hover': {
        backgroundColor: '#dddddd', 
        color: 'black', 
      }
    },
    div: {
      margin: '15px 0'
    },
    label: {
      fontWeight: 'bold'
    },
    span: {
      marginLeft: '10px'
    },
    title: {
      fontSize: '30px'
    }
    
  };

  return (
    <div style={styles.walletManager}>
      <div style={styles.div}>
      <div style={styles.div}>
          <label style={styles.title}>Welcome to Gimo Wallet! </label>
        </div> <br></br>
        <div style={styles.div}>
          <label style={styles.label}>Account Name: </label> <br></br>
          <span style={styles.span}>{accountName}</span>
        </div>
        <div style={styles.div}>
          <label style={styles.label}>Account Address: </label>
          <span style={styles.span}>{account || "0x0000000000000000000000000000000000000000"}</span>
        </div>
        <div style={styles.div}>
          <label style={styles.label}>Balance: </label> <br></br>
          <span style={styles.span}>{balance !== null ? `${balance} ETH` : "ETH"}</span>
        </div>
      </div> <br></br>
      {/* Button to change name form */}
      <br></br>
      <button onClick={depositOneEth} style={{ ...styles.button, ...styles.buttonSuccess }}>
        Deposit: 1 ETH
      </button>
      <button onClick={withdrawOneEth} style={{ ...styles.button, ...styles.buttonWarning }}>
        Withdraw: 1 ETH
      </button> <br></br>
      <button onClick={handleChangeName} style={{ ...styles.button, ...styles.buttonPrimary }}>
        Change Name
      </button>
      {/* Change name form */}
      {showChangeName && (
        <div style={styles.div}>
          <input 
            type="text" 
            placeholder="New Name" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
          />
          <button onClick={handleSubmitName} style={{ ...styles.button, ...styles.buttonSuccess }}>
            Confirm
          </button>
        </div>
      )}<br></br>
      <button
        onClick={connectWallet}
        style={{ ...styles.button, ...styles.buttonPrimary }}
      >
        Connect your wallet
      </button>
    </div>
  );
};

export default App;
