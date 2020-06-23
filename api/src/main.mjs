import DIDService from "./did.mjs";
import VCService from "./vc.mjs";

const test = async() => {
	const didService = new DIDService();
	const vcService = new VCService( didService );

	const issuer = await didService.createDID();
	const subject = await didService.createDID();

	console.log( 'Issuer: ' + issuer.did );
	console.log( JSON.stringify( issuer.document, null, 2 ) );
	console.log('-----------------------------------------------')
	console.log( 'Subject: ' + subject.did );
	console.log( JSON.stringify( subject.document, null, 2 ) );
	console.log('-----------------------------------------------')

	const credential = await vcService.createVC( issuer, subject );
	console.log('Credential: ' + credential.id);
	console.log( JSON.stringify( credential, null, 2 ) );

	console.log( await vcService.verify( credential ) );

	console.log( await vcService.verify( JSON.parse( '{\n' +
		'  "@context": [\n' +
		'    "https://www.w3.org/2018/credentials/v1",\n' +
		'    "https://www.w3.org/2018/credentials/examples/v1"\n' +
		'  ],\n' +
		'  "id": "https://id.lacchain.net/credentials/",\n' +
		'  "type": [\n' +
		'    "VerifiableCredential"\n' +
		'  ],\n' +
		'  "issuer": "did:lacchain:EiBrqNFQ0Rv0lLOVQ7LTanY1tYVD4UbwC7JVzFchZ7m_2Q",\n' +
		'  "issuanceDate": "2010-01-01T19:23:24Z",\n' +
		'  "credentialSubject": {\n' +
		'    "id": "did:lacchain:EiD2eZUZOaErWNwdkcAK9_CHTii-9NFMB9B8h_ZwrVNZng",\n' +
		'    "name": "Sergio Cerón Figueroa",\n' +
		'    "degree": "PhD"\n' +
		'  },\n' +
		'  "proof": {\n' +
		'    "type": "EcdsaSecp256k1Signature2019",\n' +
		'    "created": "2020-06-06T04:21:36Z",\n' +
		'    "jws": "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..MEQCIB-ot-WGINrYwnS8gJIWyoEWNAu2y_VKhxZxBU_10UE1AiAP8fsB4InaZlKrOVqvfVxKO7PhfVoc98JsAQr_i_I2kw",\n' +
		'    "proofPurpose": "assertionMethod",\n' +
		'    "verificationMethod": "did:key:ltrIYLQ5iHwWU_lB-FUFRj-72A_MrsuBAQ3eDkcvrpE"\n' +
		'  }\n' +
		'}' ) ) );
}

test();