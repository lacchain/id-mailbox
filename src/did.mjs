import elementlib from "../lib/element-lib";

export default class DIDService {

	constructor() {
		const db = new elementlib.adapters.database.ElementCouchDBAdapter( {
			name: 'element-test',
			host: 'localhost',
		} );

		const storage = elementlib.adapters.storage.ipfs.configure( {
			multiaddr: '/ip4/127.0.0.1/tcp/5001',
		} );

		const blockchain = elementlib.adapters.blockchain.lacchain.configure( {
			mnemonic:
				'hazard pride garment scout search divide solution argue wait avoid title cave',
			hdPath: "m/44'/60'/0'/0/0",
			providerUrl: 'http://34.69.22.82:4545',
			anchorContractAddress: '0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e',
		} );

		const parameters = {
			maxOperationsPerBatch: 5,
			batchingIntervalInSeconds: 1,
			didMethodName: 'did:lacchain',
			logLevel: 'error',
			mapSync: false,
			maxNumberOfBlocksPerSync: 1000,
		};

		this.sidetree = new elementlib.Sidetree( { db, blockchain, storage, parameters } );
	}

	async createDID() {
		const wallet = await this.sidetree.op.getNewWallet();
		const primary = wallet.extractByTags( ["#primary"] )[0]
		const didDocument = await this.sidetree.op.walletToInitialDIDDoc( wallet );

		const payload = this.sidetree.op.getCreatePayload( didDocument, primary );
		const transaction = await this.sidetree.batchScheduler.writeNow( payload );
		const suffix = this.sidetree.func.getDidUniqueSuffix( payload );
		const did = `did:lacchain:${suffix}`;

		return {
			wallet,
			transaction,
			document: didDocument,
			did
		}
	}

	async resolve( did ) {
		return await this.sidetree.resolve( did, true );
	}

}