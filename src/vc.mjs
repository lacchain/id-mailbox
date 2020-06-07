import Secp256k1KeyPair from "secp256k1-key-pair";
import bs58 from "bs58";
import EcdsaSepc256k1Signature2019 from "ecdsa-secp256k1-signature-2019";
import vc from "vc-js";
import jld from "jsonld-signatures";

import didContext from "did-context";

export default class VCService {

	constructor( didService ) {
		this.didService = didService;
	}

	async createVC( issuer, subject ) {
		const credential = {
			"@context": [
				"https://www.w3.org/2018/credentials/v1",
				"https://www.w3.org/2018/credentials/examples/v1"
			],
			"id": "https://id.lacchain.net/credentials/",
			"type": ["VerifiableCredential"],
			"issuer": issuer.did,
			"issuanceDate": "2010-01-01T19:23:24Z",
			"credentialSubject": {
				"id": subject.did,
				"name": "Sergio Cerón Figueroa",
				"degree": "PhD"
			}
		};

		const key = issuer.wallet.extractByTags( ["#primary"] )[0]
		const keyPair = new Secp256k1KeyPair( {
			privateKeyBase58: bs58.encode( Buffer.from( key.privateKey, 'hex' ) ),
			publicKeyBase58: bs58.encode( Buffer.from( key.publicKey, 'hex' ) ),
			options: {}
		} );
		keyPair.id = 'did:key:' + key.kid; // TODO: add custom resolve document and in did creation, add custom or change to normal public key here
		keyPair.controller = issuer.did

		const suite = new EcdsaSepc256k1Signature2019( {
			verificationMethod: keyPair.id,
			key: keyPair
		} );

		return await vc.issue( { credential, suite } );
	}

	async verify( credential ) {
		const keyIndex = 1; // Primary Key
		const issuer = await this.didService.resolve( credential.issuer );
		const keyPair = new Secp256k1KeyPair( {
			publicKeyBase58: bs58.encode( Buffer.from( issuer.publicKey[keyIndex].publicKeyHex, 'hex' ) ),
			options: {}
		} );
		keyPair.id = issuer.assertionMethod[keyIndex];
		keyPair.controller = issuer.id;

		const suite = new EcdsaSepc256k1Signature2019( {
			verificationMethod: keyPair.id,
			key: keyPair
		} );

		const documentLoader = jld.extendContextLoader( async url => {
			if( url.startsWith( 'did:lacchain' ) ) {
				const document = await this.didService.resolve( url );
				return {
					contextUrl: null,
					documentUrl: url,
					document
				};
			} else if( url.startsWith( 'did:key' ) ) {
				const document = url.replace('did:key:', '#');
				return {
					contextUrl: null,
					documentUrl: url,
					document
				};
			} else if( url === 'https://www.w3.org/ns/did/v1' ) {
				const document = '{\n' +
					'  "@context": {\n' +
					'    "@version": 1.1,\n' +
					'    "id": "@id",\n' +
					'    "type": "@type",\n' +
					'    "dc": "http://purl.org/dc/terms/",\n' +
					'    "schema": "http://schema.org/",\n' +
					'    "sec": "https://w3id.org/security#",\n' +
					'    "didv": "https://w3id.org/did#",\n' +
					'    "xsd": "http://www.w3.org/2001/XMLSchema#",\n' +
					'    "EcdsaSecp256k1VerificationKey2019": "sec:EcdsaSecp256k1VerificationKey2019",\n' +
					'    "Ed25519Signature2018": "sec:Ed25519Signature2018",\n' +
					'    "Ed25519VerificationKey2018": "sec:Ed25519VerificationKey2018",\n' +
					'    "RsaVerificationKey2018": "sec:RsaVerificationKey2018",\n' +
					'    "SchnorrSecp256k1VerificationKey2019": "sec:SchnorrSecp256k1VerificationKey2019",\n' +
					'    "ServiceEndpointProxyService": "didv:ServiceEndpointProxyService",\n' +
					'    "assertionMethod": {\n' +
					'      "@id": "sec:assertionMethod",\n' +
					'      "@type": "@id",\n' +
					'      "@container": "@set"\n' +
					'    },\n' +
					'    "authentication": {\n' +
					'      "@id": "sec:authenticationMethod",\n' +
					'      "@type": "@id",\n' +
					'      "@container": "@set"\n' +
					'    },\n' +
					'    "capabilityDelegation": {\n' +
					'      "@id": "sec:capabilityDelegationMethod",\n' +
					'      "@type": "@id",\n' +
					'      "@container": "@set"\n' +
					'    },\n' +
					'    "capabilityInvocation": {\n' +
					'      "@id": "sec:capabilityInvocationMethod",\n' +
					'      "@type": "@id",\n' +
					'      "@container": "@set"\n' +
					'    },\n' +
					'    "controller": {\n' +
					'      "@id": "sec:controller",\n' +
					'      "@type": "@id"\n' +
					'    },\n' +
					'    "created": {\n' +
					'      "@id": "dc:created",\n' +
					'      "@type": "xsd:dateTime"\n' +
					'    },\n' +
					'    "keyAgreement": {\n' +
					'      "@id": "sec:keyAgreementMethod",\n' +
					'      "@type": "@id",\n' +
					'      "@container": "@set"\n' +
					'    },\n' +
					'    "proof": {\n' +
					'      "@id": "sec:proof",\n' +
					'      "@type": "@id",\n' +
					'      "@container": "@graph"\n' +
					'    },\n' +
					'    "publicKey": {\n' +
					'      "@id": "sec:publicKey",\n' +
					'      "@type": "@id",\n' +
					'      "@container": "@set"\n' +
					'    },\n' +
					'    "publicKeyBase58": "sec:publicKeyBase58",\n' +
					'    "publicKeyPem": "sec:publicKeyPem",\n' +
					'    "publicKeyJwk": {\n' +
					'      "@id": "sec:publicKeyJwk",\n' +
					'      "@type": "@json"\n' +
					'    },\n' +
					'    "service": {\n' +
					'      "@id": "didv:service",\n' +
					'      "@type": "@id",\n' +
					'      "@container": "@set"\n' +
					'    },\n' +
					'    "serviceEndpoint": {\n' +
					'      "@id": "didv:serviceEndpoint",\n' +
					'      "@type": "@id"\n' +
					'    },\n' +
					'    "updated": {\n' +
					'      "@id": "dc:modified",\n' +
					'      "@type": "xsd:dateTime"\n' +
					'    },\n' +
					'    "verificationMethod": {\n' +
					'      "@id": "sec:verificationMethod",\n' +
					'      "@type": "@id"\n' +
					'    }\n' +
					'  }\n' +
					'}'
				return {
					contextUrl: null,
					documentUrl: url,
					document
				};
			}
			return vc.defaultDocumentLoader( url );
		} );

		return await vc.verifyCredential( { credential, suite, documentLoader } );
	}
}