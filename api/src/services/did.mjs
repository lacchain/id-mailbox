import Web3 from 'web3';
import DIDResolver from 'did-resolver';
import ethr from 'ethr-did-resolver';
import web from 'web-did-resolver';
import EthrDID from '../utils/ethr-did';
import { generateKeyPair } from "../utils/crypt";
import secp256k1 from "secp256k1";

export default class DIDService {

	constructor() {
		const providerConfig = {
			networks: [
				{
					name: "rsk:testnet",
					registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
					rpcUrl: "https://did.testnet.rsk.co:4444"
				},
				{
					name: "lacchain",
					registry: "0xd6A7c915066E17ba18024c799258C8A286fFBc00",
					rpcUrl: "http://35.184.61.29:4545"
				}
			]
		}

		const ethrResolver = ethr.getResolver( providerConfig );
		const webResolver = web.getResolver();

		this.resolver = new DIDResolver.Resolver( {
			...ethrResolver,
			...webResolver
		} );
		this.web3 = new Web3( "http://35.184.61.29:4545", {
			network_id: 648539,
			gas: 0,
			gasPrice: 0
		} );
		this.web3.currentProvider.sendAsync = this.web3.currentProvider.send;
	}

	async resolve( did ) {
		return await this.resolver.resolve( did );
	}

	async create() {
		const keyPair = EthrDID.createKeyPair()
		const ethrDid = new EthrDID( {
			...keyPair,
			provider: this.web3.currentProvider,
			registry: "0xd6A7c915066E17ba18024c799258C8A286fFBc00",
			web3: this.web3
		} );
		//const encryptionKey = generateKeyPair();
		// await ethrDid.setAttribute( 'did/pub/X25519/enc/base64', new Buffer( encryptionKey.publicKey ).toString( 'base64' ) );
		await ethrDid.setAttribute( 'did/pub/X25519/enc/base64', new Buffer( keyPair.publicKey ).toString( 'base64' ) );
		return {did: ethrDid.did, key: keyPair};
	}

	async setAttribute(key, value, {address, privateKey}) {
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
		return {did: ethrDid.did, key: keyPair};
	}

}