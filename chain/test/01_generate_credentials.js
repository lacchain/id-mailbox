import EIP712Domain from 'eth-typed-data';

const elliptic = require("elliptic");
const secp256k1 = new elliptic.ec("secp256k1")
const { expect } = require('chai');

const EthereumDIDRegistry = artifacts.require("EthereumDIDRegistry");
const Verifier = artifacts.require("Verifier");

describe('Verification Request', function() {

  let Know;
  let accounts;
  let ethereumDIDRegistryContract;
  let verifierContract;

  before(async function() {
    accounts = await web3.eth.getAccounts()
    ethereumDIDRegistryContract = await EthereumDIDRegistry.deployed();
    verifierContract = await Verifier.deployed();

    await ethereumDIDRegistryContract.addDelegate(accounts[0], Buffer.from('veriKey', 'utf8'), '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', 0xFFFFFFFFFFFF, {from: accounts[0]});

    let knowledgeDomain = EIP712Domain({
      name: 'Knownledge',
      version: '1',
      chainId: 648529, // LACChain chain-id
      verifyingContract: Verifier.address
    })
    Know = knowledgeDomain.createType('Know', {
      issuer: 'address',
      subject: 'address',
      validFrom: 'uint256',
      validTo: 'uint256'
    })
  })
  
  it('should generate EIP-712 claim request', async function() {
    let me = new Know({
      issuer: accounts[1],
      subject: accounts[0],
      validFrom: 25,
      validTo: 50
    })

    const cowPrivKey = secp256k1.keyFromPrivate(new Buffer('c85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf4', "hex"))
    const signature = me.sign(signerFor(cowPrivKey));

    await mockCertifiedAuthority(me, signature)
  })

  async function mockCertifiedAuthority(claim, signature) {
    const sender = ecrecover(claim.signHash(), signature)
    const subjectOwner = await ethereumDIDRegistryContract.identityOwner(claim.subject)
    expect(sender).to.equal(subjectOwner);

    //console.log(await verifierContract.verify(claim, '0x' + (signature.recoveryParam + 27).toString(16), '0x' + signature.r.toString('hex'), '0x' + signature.s.toString('hex')));
  }
  
})


const signerFor = (secp256k1Key) => {
  return (data) => secp256k1Key.sign(data);
}

const ecrecover = (hash, signature) => {
  const ecPublicKey = secp256k1.recoverPubKey(new Buffer(hash, "hex"), signature, signature.recoveryParam < 2 ? signature.recoveryParam : 1 - (signature.recoveryParam % 2)); // because odd vals mean v=0... sadly that means v=0 means v=1... I hate that
  const publicKey = "0x" + ecPublicKey.encode("hex", false).slice(2);
  const publicHash = web3.utils.keccak256(publicKey);
  const address = toChecksum("0x" + publicHash.slice(-40));
  return address;
}

const toChecksum = address => {
  const addressHash = web3.utils.keccak256(address.slice(2));
  let checksumAddress = "0x";
  for (let i = 0; i < 40; i++) checksumAddress += parseInt(addressHash[i + 2], 16) > 7 ? address[i + 2].toUpperCase() : address[i + 2];
  return checksumAddress;
};

