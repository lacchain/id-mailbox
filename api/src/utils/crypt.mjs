import nacl from 'tweetnacl';

export const generateKeyPair = () => {
	const keyPair = nacl.box.keyPair();
	return {
		publicKey: new Buffer(keyPair.publicKey).toString('hex'),
		privateKey: new Buffer(keyPair.secretKey).toString('hex')
	}
}