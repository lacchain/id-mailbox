import { didService } from '../src/services'

didService.create().then( ( { did, key } ) => {
	console.log( 'DID: ', did );
	console.log( 'Private Key: ', key.privateKey );
	//console.log( 'Encryption Key: ', encryptionKey.privateKey );
	//const array = new Uint8Array(Buffer.from(hex, 'hex'));
} );

