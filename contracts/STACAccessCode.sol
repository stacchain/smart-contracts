// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract STACAccessCode {
    address public owner;
    uint256 public accessPrice; // Price for the access code in wei
    uint256 public defaultValidityPeriod = 30 days; // Default validity period (modifiable by the owner)

    struct AccessData {
        bytes32 hashedCode; // Hashed access code
        uint256 expiryTime; // Expiration timestamp
    }

    mapping(address => AccessData) private accessRecords; // Tracks access data for each user
    mapping(address => bool) public hasPurchased; // Tracks whether a user has purchased access

    event AccessCodeGenerated(address indexed user, uint256 expiryTime);
    event AccessCodeRevoked(address indexed user);
    event AccessPriceUpdated(uint256 newPrice);
    event ValidityPeriodUpdated(uint256 newValidityPeriod);

    constructor(uint256 _accessPrice) {
        owner = msg.sender;
        accessPrice = _accessPrice;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    /// @notice Allows users to purchase an access code
    /// @return accessCode The generated access code
    function purchaseAccessCode() external payable returns (string memory accessCode) {
        require(msg.value == accessPrice, "Incorrect payment amount");
        require(!hasPurchased[msg.sender], "Access already purchased");

        // Generate a unique access code
        accessCode = _generateAccessCode(msg.sender);

        // Store the hashed access code and expiration time
        accessRecords[msg.sender] = AccessData({
            hashedCode: keccak256(abi.encodePacked(accessCode)),
            expiryTime: block.timestamp + defaultValidityPeriod
        });
        hasPurchased[msg.sender] = true;

        emit AccessCodeGenerated(msg.sender, accessRecords[msg.sender].expiryTime);

        return accessCode;
    }

    /// @notice Verifies if a provided access code is valid
    /// @param user The address of the user
    /// @param accessCode The access code to verify
    /// @return isValid True if the access code is valid
    function verifyAccessCode(address user, string memory accessCode) external view returns (bool isValid) {
        AccessData memory data = accessRecords[user];
        require(block.timestamp <= data.expiryTime, "Access code has expired");
        return data.hashedCode == keccak256(abi.encodePacked(accessCode));
    }

    /// @notice Revokes a user's access
    /// @param user The address of the user to revoke
    function revokeAccess(address user) external onlyOwner {
        require(hasPurchased[user], "User has not purchased access");

        delete accessRecords[user];
        hasPurchased[user] = false;

        emit AccessCodeRevoked(user);
    }

    /// @notice Updates the access price
    /// @param _newPrice The new price for an access code
    function updateAccessPrice(uint256 _newPrice) external onlyOwner {
        accessPrice = _newPrice;
        emit AccessPriceUpdated(_newPrice);
    }

    /// @notice Updates the default validity period for access codes
    /// @param _newPeriod The new validity period in seconds
    function updateValidityPeriod(uint256 _newPeriod) external onlyOwner {
        defaultValidityPeriod = _newPeriod;
        emit ValidityPeriodUpdated(_newPeriod);
    }

    /// @notice Withdraws all funds from the contract
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    /// @notice Generates a unique access code for a user
    /// @param user The user's address
    /// @return The generated access code
    function _generateAccessCode(address user) internal view returns (string memory) {
        return string(abi.encodePacked("STAC-", _toHex(abi.encodePacked(block.timestamp, user))));
    }

    /// @notice Converts bytes to a hexadecimal string
    /// @param data The bytes to convert
    /// @return The hexadecimal string
    function _toHex(bytes memory data) internal pure returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory hexString = new bytes(data.length * 2);
        for (uint256 i = 0; i < data.length; i++) {
            hexString[i * 2] = hexChars[uint8(data[i] >> 4)];
            hexString[i * 2 + 1] = hexChars[uint8(data[i] & 0x0f)];
        }
        return string(hexString);
    }
}
