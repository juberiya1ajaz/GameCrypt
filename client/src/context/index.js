import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useNavigate } from 'react-router-dom';
import { ABI, ADDRESS } from '../contracts';
import { eventListner } from './eventListner';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {

    const [walletAddress, setWalletAddress] = useState('');
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [showAlert, setShowAlert] = useState({ status: false, type: 'info', message: '' });

    const updateCurrentWalletAddress = async () => {
        const accounts = await window?.ethereum?.request({ method: 'eth_requestAccounts' });

        if (accounts) setWalletAddress(accounts[0]);
    };

    useEffect(() => {
        updateCurrentWalletAddress();

        window?.ethereum?.on('accountsChanged', updateCurrentWalletAddress);
    }, []);

    useEffect(() => {
        const setSmartContractAndProvider = async () => {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const newProvider = new ethers.providers.Web3Provider(connection);
            const signer = newProvider.getSigner();
            const newContract = new ethers.Contract(ADDRESS, ABI, signer);

            setProvider(newProvider);
            setContract(newContract);
        };

        setSmartContractAndProvider();
    }, []);

    useEffect(() => {
        if (contract) {
            eventListner({
          });
        }
      }, []);

    useEffect(() => {
        if (showAlert?.status) {
            const timer = setTimeout(() => {
                setShowAlert({ status: false, type: 'info', message: '' });
            }, [5000]);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);


    return (
        <GlobalContext.Provider value={{
            // player1Ref,
            // player2Ref,
            // showdownGround,
            // setShowdownGround,
            contract,
            // gameData,
            walletAddress,
            updateCurrentWalletAddress,
            showAlert,
            setShowAlert,
            // showdownName,
            // setShowdownName,
            // errorMessage,
            // setErrorMessage,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);