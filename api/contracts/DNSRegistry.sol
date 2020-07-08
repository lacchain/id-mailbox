pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";

contract DNSRegistry is OwnableUpgradeSafe {

	struct DIDStruct {
		string entity;
		uint expires;
		bool status;
	}

	function initialize() public initializer {
		OwnableUpgradeSafe.__Ownable_init();
	}

	mapping(address => DIDStruct) private dids;
	address[] public addresses;

	event DIDAdded(
		address indexed did,
		uint expires
	);

	event DIDRevoked(
		address indexed did
	);

	event DIDRemoved(
		address indexed did
	);

	event DIDEnabled(
		address indexed did,
		uint expires
	);

	function addDID(address did, uint validity, string calldata entity) onlyOwner external returns (bool) {
		DIDStruct storage _did = dids[did];
		require( validity > 0, "Validity must be greater than zero");
		require( _did.expires == 0, "DID already exists");
		_did.entity = entity;
		_did.expires = now + validity;
		_did.status = true;

		dids[did] = _did;
		addresses.push( did );
		emit DIDAdded(did, _did.expires);
		return true;
	}

	function revokeDID(address did) onlyOwner external returns (bool)  {
		DIDStruct storage _did = dids[did];
		require(_did.expires > 0, "DID not exists");
		require(_did.status, "DID already revoked");

		_did.status = false;

		dids[did] = _did;

		emit DIDRevoked(did);
		return true;
	}

	function enableDID(address did, uint validity) onlyOwner external returns (bool)  {
		DIDStruct storage _did = dids[did];
		require(_did.expires > 0, "DID not exists");

		_did.status = true;
		_did.expires = now + validity;

		dids[did] = _did;

		emit DIDEnabled(did, _did.expires);
		return true;
	}

	function removeDID(uint index) onlyOwner external returns (bool)  {
		require(index > 0 && index < addresses.length, "Invalid index");

		address did = addresses[index];

		require(did != address(0), "Invalid DID");

		DIDStruct storage _did = dids[did];

		_did.status = false;
		_did.entity = "";
		_did.expires = 0;

		dids[did] = _did;
		delete addresses[index];

		emit DIDRemoved(did);
		return true;
	}

	function getDID(address did) public view returns (DIDStruct memory) {
		return dids[did];
	}

	function getDIDs() public view returns (address[] memory){
		return addresses;
	}

}