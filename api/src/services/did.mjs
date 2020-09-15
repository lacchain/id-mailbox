import Web3 from 'web3';
import DIDResolver from 'did-resolver';
import ethr from '../utils/eth-did-resolver.mjs';
import web from 'web-did-resolver';
import EthrDID from '../utils/ethr-did';
import ethers from "ethers";
import axios from "axios";

export default class DIDService {

	constructor() {
		const providerConfig = {
			networks: [
				{
					name: "mainnet",
					registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
					rpcUrl: "https://mainnet.infura.io/v3/8d049ba5bac74463a8346b378acab3cf"
				},
				{
					name: "ropsten",
					registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
					rpcUrl: "https://ropsten.infura.io/v3/8d049ba5bac74463a8346b378acab3cf"
				},
				{
					name: "kovan",
					registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
					rpcUrl: "https://kovan.infura.io/v3/8d049ba5bac74463a8346b378acab3cf"
				},
				{
					name: "rinkeby",
					registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
					rpcUrl: "https://rinkeby.infura.io/v3/8d049ba5bac74463a8346b378acab3cf"
				},
				{
					name: "goerli",
					registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
					rpcUrl: "https://goerli.infura.io/v3/8d049ba5bac74463a8346b378acab3cf"
				},
				{
					name: "rsk:testnet",
					registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
					rpcUrl: "https://did.testnet.rsk.co:4444"
				},
				{
					name: "lacchain",
					registry: "0x488C83c4D1dDCF8f3696273eCcf0Ff4Cf54Bf277",
					rpcUrl: "https://writer.lacchain.net"
				}
			]
		}

		const ethrResolver = ethr.getResolver( providerConfig );
		const webResolver = web.getResolver();

		this.resolver = new DIDResolver.Resolver( {
			...ethrResolver,
			...webResolver,
			btcr: async( did, parsed ) => {
				const didDoc = await axios.get( `http://localhost:8081/1.0/identifiers/${parsed.did}` );
				return didDoc.data;
			},
			sov: async( did, parsed ) => {
				const didDoc = await axios.get( `http://localhost:8082/1.0/identifiers/${parsed.did}` );
				return didDoc.data;
			},
			nacl: async( did, parsed ) => {
				const didDoc = await axios.get( `http://localhost:8083/1.0/identifiers/${parsed.did}` );
				return didDoc.data;
			},
			elem: async( did, parsed ) => {
				const didDoc = await axios.get( `http://localhost:8084/api/v1/sidetree/${parsed.did}` );
				return didDoc.data;
			}
		} );
		this.web3 = new Web3( "https://writer.lacchain.net", {
			network_id: 648539,
			gas: 0,
			gasPrice: 0
		} );
		this.web3.currentProvider.sendAsync = this.web3.currentProvider.send;

		this.dnsRegistry = new ethers.Contract( "0x1024d31846670b356f952F4c002E3758Ab9c4FFC", [
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "did",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "expires",
						"type": "uint256"
					}
				],
				"name": "DIDAdded",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "did",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "expires",
						"type": "uint256"
					}
				],
				"name": "DIDEnabled",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "did",
						"type": "address"
					}
				],
				"name": "DIDRemoved",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "did",
						"type": "address"
					}
				],
				"name": "DIDRevoked",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "previousOwner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "OwnershipTransferred",
				"type": "event"
			},
			{
				"constant": false,
				"inputs": [
					{
						"internalType": "address",
						"name": "did",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "validity",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "entity",
						"type": "string"
					}
				],
				"name": "addDID",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "addresses",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"internalType": "address",
						"name": "did",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "validity",
						"type": "uint256"
					}
				],
				"name": "enableDID",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [
					{
						"internalType": "address",
						"name": "did",
						"type": "address"
					}
				],
				"name": "getDID",
				"outputs": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "entity",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "expires",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "status",
								"type": "bool"
							}
						],
						"internalType": "struct DNSRegistry.DIDStruct",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getDIDs",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "",
						"type": "address[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "initialize",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "owner",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					}
				],
				"name": "removeDID",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "renounceOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"internalType": "address",
						"name": "did",
						"type": "address"
					}
				],
				"name": "revokeDID",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "transferOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		], new ethers.providers.Web3Provider( this.web3.currentProvider ) )
	}

	async resolve( did ) {
		return this.resolver.resolve( did );
	}

	async dns( did ) {
		const record = await this.dnsRegistry.getDID( did.replace( 'did:ethr:lacchain:', '' ) );
		/*if( !record || record.expires <= 0 ) return 'unknown';
		if( moment().isAfter( record.expires.toNumber() * 1000 ) ) return 'expired';

		return record.status ? 'active' : 'revoked';*/
		return {
			entity: record.entity,
			expires: record.expires.toNumber() * 1000,
			status: record.status
		}
	}

	async create() {
		const keyPair = EthrDID.createKeyPair()
		const ethrDid = new EthrDID( {
			...keyPair,
			provider: this.web3.currentProvider,
			registry: "0xd6A7c915066E17ba18024c799258C8A286fFBc00",
			web3: this.web3
		} );
		await ethrDid.setAttribute( 'did/pub/X25519/enc/base64', new Buffer( keyPair.publicKey ).toString( 'base64' ) );
		return { did: ethrDid.did, key: keyPair };
	}

	async setAttribute( key, value, { address, privateKey } ) {
		const keyPair = EthrDID.createKeyPair()
		const ethrDid = new EthrDID( {
			address,
			privateKey,
			provider: this.web3.currentProvider,
			registry: "0xd6A7c915066E17ba18024c799258C8A286fFBc00",
			web3: this.web3
		} );
		//const encryptionKey = generateKeyPair();
		// await ethrDid.setAttribute( 'did/pub/X25519/enc/base64', new Buffer( encryptionKey.publicKey ).toString( 'base64' ) );
		await ethrDid.setAttribute( key, value );
		return { did: ethrDid.did, key: keyPair };
	}

}