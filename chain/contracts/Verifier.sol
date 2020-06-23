pragma solidity >=0.4.4;
pragma experimental ABIEncoderV2;

contract EthereumDIDRegistry {
  function validDelegate(address identity, bytes32 delegateType, address delegate) public view returns(bool);
}

contract Verifier {

    struct EIP712Domain {
        string  name;
        string  version;
        uint256 chainId;
        address verifyingContract;
    }

    struct Know {
        address issuer;
        address subject;
        uint256 validFrom;
        uint256 validTo;
    }

    bytes32 constant EIP712DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    bytes32 constant KNOW_TYPEHASH = keccak256(
        "Know(address subject,uint256 validFrom,uint256 validTo)"
    );

    mapping (bytes32 => mapping (address => uint)) public revocations;
    mapping (address => mapping (address => uint)) public knows;
    bytes32 DOMAIN_SEPARATOR;
    EthereumDIDRegistry registry;

    constructor (address _registryAddress) public {
        DOMAIN_SEPARATOR = hash(EIP712Domain({
            name: "Knownledge",
            version: '1',
            chainId: 648529,
            verifyingContract: address(this)
        }));
        registry = EthereumDIDRegistry(_registryAddress);
    }

    function hash(EIP712Domain memory eip712Domain) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            EIP712DOMAIN_TYPEHASH,
            keccak256(bytes(eip712Domain.name)),
            keccak256(bytes(eip712Domain.version)),
            eip712Domain.chainId,
            eip712Domain.verifyingContract
        ));
    }

    function hash(Know memory known) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            KNOW_TYPEHASH,
            known.subject,
            known.validFrom,
            known.validTo
        ));
    }

    function verify(Know memory known, uint8 v, bytes32 r, bytes32 s) public view returns (bool) {
        // Note: we need to use `encodePacked` here instead of `encode`.
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            hash(known)
        ));
        return verifyIssuer(digest, known.issuer, known.subject, v, r, s) && valid(known.validFrom, known.validTo);
    }

    function valid(uint256 validFrom, uint256 validTo) internal view returns (bool) {
        return (validFrom >= block.timestamp) && (block.timestamp < validTo);
    }

    function vouch(address subject) public {
        knows[msg.sender][subject] = block.number;
    }

    function verifyIssuer(bytes32 digest, address issuer, address subject, uint8 v, bytes32 r, bytes32 s) internal view returns (bool) {
        //&& !revoked(issuer, subject)
        return !revoked(issuer, digest) && registry.validDelegate(issuer, "veriKey", ecrecover(digest, v, r, s));
    }

    function revoke(bytes32 digest) public returns (bool) {
        revocations[digest][msg.sender] = block.number;
        return true;
    }

    function revoked(address party, bytes32 digest) public view returns (bool) {
        return revocations[digest][party] > 0;
    }
}
