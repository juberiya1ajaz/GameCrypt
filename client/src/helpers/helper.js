import { ContractId, ContractExecuteTransaction } from "@hashgraph/sdk";
import {HashConnect} from 'hashconnect';

let contractId = ContractId.fromString("0.0.47907889");
let hashconnect = new HashConnect();

let saveData = {
  topic: "",
  pairingString: "",
  privateKey: "",
  pairedWalletData: null,
  pairedAccounts: [],
};
let accountId = ""

// Hedera implementation
export async function nft() {

  const provider = hashconnect.getProvider('testnet', saveData.topic,  accountId)
  const signer = hashconnect.getSigner(provider)
  const stakeTx  = await new ContractExecuteTransaction() 
      .setContractId(contractId)
      .setGas(500000)
      .setPayableAmount(50)
      .setFunction("stakeTokens")
      .freezeWithSigner(signer);

  const result = await stakeTx.executeWithSigner(signer);
  console.log(result)

}

export const wait = ms =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export const attack = ({ attacker, receiver }) => {
  const receivedDamage =
    attacker.attack - (attacker.level - receiver.level) * 1.25;

  const finalDamage = receivedDamage - receiver.defense / 2;

  return finalDamage;
};

export const heal = ({ receiver }) => {
  return receiver.magic + receiver.level * 0.25;
};
