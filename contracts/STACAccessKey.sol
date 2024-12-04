// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract STACAccessKey {
    address public owner;
    uint256 public keyPrice; // Price of the access key in wei
    mapping(address => string) public accessKeys; // Stores access keys for buyers
    mapping(string => bool) public validKeys; // Tracks valid keys

    // Events
    event KeyPurchased(address indexed buyer, string accessKey);
    event KeyRevoked(address indexed user, string accessKey);
    event KeyPriceUpdated(uint256 newPrice);

    constructor(uint256 _keyPrice) {
        owner = msg.sender;
        keyPrice = _keyPrice;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /// @notice Allows users to purchase an access key for the STAC collection
    function purchaseAccess() external payable returns (string memory) {
        require(msg.value == keyPrice, "Incorrect amount sent");
        require(bytes(accessKeys[msg.sender]).length == 0, "You already have access");

        // Generate a unique access key
        string memory accessKey = generateAccessKey(msg.sender);
        accessKeys[msg.sender] = accessKey;
        validKeys[accessKey] = true;

        // Emit event to notify external services
        emit KeyPurchased(msg.sender, accessKey);

        return accessKey;
    }

    /// @notice Allows the owner to revoke access for a user
    /// @param _user The address of the user to revoke access from
    function revokeAccess(address _user) external onlyOwner {
        string memory accessKey = accessKeys[_user];
        require(bytes(accessKey).length != 0, "User does not have access");

        validKeys[accessKey] = false;
        delete accessKeys[_user];

        // Emit event to notify external services
        emit KeyRevoked(_user, accessKey);
    }

    /// @notice Allows the owner to update the price of the access key
    /// @param _newPrice The new price in wei
    function updateKeyPrice(uint256 _newPrice) external onlyOwner {
        keyPrice = _newPrice;
        emit KeyPriceUpdated(_newPrice);
    }

    /// @notice Generates a unique access key based on the buyer's address and block data
    /// @param _buyer The address of the buyer
    /// @return The generated access key
    function generateAccessKey(address _buyer) internal view returns (string memory) {
        return string(
            abi.encodePacked(
                toHex(abi.encodePacked(block.timestamp, _buyer, blockhash(block.number - 1)))
            )
        );
    }

    /// @notice Converts bytes to a hexadecimal string
    function toHex(bytes memory data) internal pure returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory str = new bytes(data.length * 2);
        for (uint256 i = 0; i < data.length; i++) {
            str[i * 2] = hexChars[uint8(data[i] >> 4)];
            str[i * 2 + 1] = hexChars[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }
}
