import eciesjs from 'eciesjs'
import bip39 from "bip39";
import secp256k1 from "secp256k1";
import hdkey from "hdkey";

const seed = bip39.mnemonicToSeedSync( "twin fold when essay message slush busy visit scissors away wine caution" );
const root = hdkey.fromMasterSeed( seed );
const addrNode = root.derive( "m/44'/60'/0'/1/1" );
const privateKeyHex = addrNode._privateKey.toString( 'hex' );
const publicKeyHex = Buffer.from( secp256k1.publicKeyCreate( Buffer.from( privateKeyHex, 'hex' ) ) ).toString( 'hex' )

const data = 'this is a test';

const encrypted = eciesjs.encrypt( publicKeyHex, Buffer.from( data ) );
const decrypted = eciesjs.decrypt( '0x' + privateKeyHex, encrypted ).toString()

console.log( encrypted );
console.log( decrypted );