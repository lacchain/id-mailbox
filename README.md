# 1. Creating DID

The DID method used in LACChain ID is "ethr", this method storage the public keys
and attributes of DID into a Smart Contract which is called a DIDRegitry.
In the following url is described the structure and steps to generate a new DID.

https://github.com/uport-project/ethr-did-registry

The LACChain DID Registry was deployed in the following addresses.

| Network                             | Address                                                |
| ----------------------------------- | ------------------------------------------------------ |
| MainNet (id: 1)                     |      Pending to deploy...                              |
| David19 (id: 3)                     |      Pending to deploy...                              |
| TestNet (id: 4)                     |      0xd6A7c915066E17ba18024c799258C8A286fFBc00        |

# 2. Adding Encryption Public Key
 
In order to send and receive Verifiable Credentials using LACChain ID, is necessary to encrypt the VC before to send it.
The public key associated for encryption of the VC must be added to the DID through the 
`` setAttribute(address identity, bytes32 name, bytes value, uint validity) `` function of DIDRegistry Smart Contract.

Example: 

```
DIDRegistry.setAttribute( 'did/pub/X25519/enc/base64', encryptionPublicKeyBase64 );
```  

The algorithm proposed to do that is the [NACL](link), which is an asymmetric key algorithm. 

# 3. Resolving a DID

The format of a DID is 

In order to reconstruct and resolve a DID is the following URL:

http://34.68.56.94:8080/did/{did}

Example: 

GET  http://34.68.56.94:8080/did/did:ethr:lacchain:0x01cd0acdfb36140d0dc6a4d917693ae641821891

Response:
````
{
   "@context":"https://w3id.org/did/v1",
   "id":"did:ethr:lacchain:0x01cd0acdfb36140d0dc6a4d917693ae641821891",
   "publicKey":[
      {
         "id":"did:ethr:lacchain:0x01cd0acdfb36140d0dc6a4d917693ae641821891#owner",
         "type":"Secp256k1VerificationKey2018",
         "owner":"did:ethr:lacchain:0x01cd0acdfb36140d0dc6a4d917693ae641821891",
         "ethereumAddress":"0x01cd0acdfb36140d0dc6a4d917693ae641821891"
      },
      {
         "id":"did:ethr:lacchain:0x01cd0acdfb36140d0dc6a4d917693ae641821891#delegate-1",
         "type":"X25519KeyAgreementKey2019",
         "owner":"did:ethr:lacchain:0x01cd0acdfb36140d0dc6a4d917693ae641821891",
         "publicKeyBase64":"MDQ1NzAxYzIyYTg0ZTdiMDMyNjc2YWY3YjNlZTdiZTg2MGE5NzVhODhkNzU2NzczY2Y1Yzk2MTg4ODY0NTAyZmIwNjkwZjE1M2VjODI5YjRjOTk3NDFlOWZjMDhiNjE3MTdiMjczNWI2MTMwMTk4MGNmNjFmNTM1MmU3MzkyNGFkOA=="
      }
   ],
   "authentication":[
      {
         "type":"Secp256k1SignatureAuthentication2018",
         "publicKey":"did:ethr:lacchain:0x01cd0acdfb36140d0dc6a4d917693ae641821891#owner"
      }
   ]
}
```` 

Currently, LACChain ID can resolve the following methods and networks:


 
 # 4. Sending a Verifiable Credential
 The api method to send a verifiable credential is the following 
 
 ### Authentication
 The authentication process consist in two steps:
 1. **Request a challenge**. In this step, the server will send a random string that the client must have 
 to sign with their private DID authentication key.
 
 URL Path: /vc/auth/{did}
 HTTP Method: GET
 
 Response:
 ```
{
    "challenge": "zW7dPhe2TiSTi25i"
}
 ```
2. **Send Challenge**. In this step, the client needs to send the signature of the challenge, 
among with the authentication method used to sign. 

URL Path: /vc/auth/{did}
HTTP Method: PUT

 Request Body:
 ```
{
    "signature": "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "publicKey": "63FaC9201494f0bd17B9892B9fae4d52fe3BD377"
}
 ```

Response:
```
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaWQiOiJkaWQ6ZXRocjoweGI5YzU3MTQwODk0NzhhMzI3ZjA5MTk3OTg3ZjE2ZjllNWQ5MzZlOGEiLCJpYXQiOjE1MTYyMzkwMjJ9.PPKdqAoOrLobKmovsza_bnIu0AFc0BLu8qupWmn4W5o"
}
```

 ### Sending
 Before sending a new VC, it is necessary to encrypt with the private key generated for that purpose
 in the DID method. The encrypted VC must be encoded into an array of bytes. 
To send a new VC, it is necessary to have an authentication token (jwt).

URL Path: /vc/auth/{did}
HTTP Method: POST

Request Headers:
 ```
Authorization: {jwt token}
 ```

Request Body:
 ```
{
    "subject": "did:ethr:lacchain:0x01cd0acdfb36140d0dc6a4d917693ae641821891",
    "vc": {
        "type": "Buffer", // always Buffer
        "value": [byte]
    }

}
 ```

Response Body:
 ```
{
    result: true // or false 
    error:  in  case of result=false
}
 ```

# 5. Gathering Verifiable Credentials

 To get the list of VC associated with some DID, it is necessary to have an authentication token (jwt).
 
URL Path: /vc/{did}
HTTP Method: GET

Request Headers:
 ```
Authorization: {jwt token}
 ```

Response Body:
 ```
[
	{
		"type": "Buffer",
		"data": [encrypted buffer data bytes]
	}
]
 ```
