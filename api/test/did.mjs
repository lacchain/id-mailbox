import { didService } from '../src/services'

/*didService.create().then( ( { did, key } ) => {
	console.log( 'DID: ', did );
	console.log( 'Private Key: ', key.privateKey );
	//console.log( 'Encryption Key: ', encryptionKey.privateKey );
	//const array = new Uint8Array(Buffer.from(hex, 'hex'));
} );*/

didService.resolve('did:ethr:lacchain:0x8a01111221828ceda89b7610f7e5d4166f3eb7cf').then( result => {
	console.log(JSON.stringify(result, null, 2));
} );