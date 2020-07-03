import util from "ethereumjs-util";
import randomstring from "randomstring";

const privateKey = randomstring.generate( { length: 64, charset: 'hex' } );
const publicKey = util.privateToPublic( `0x${privateKey}` ).toString( 'hex' );

console.log( 'Public Key', publicKey );
console.log( 'Private Key', privateKey );