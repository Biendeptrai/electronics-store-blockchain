// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ElectronicsStore {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    struct Order {
        uint256 orderId;
        uint256 productId;
        uint256 amountVND;
        address buyer;
        string offchainTx;
        uint256 createdAt;
    }

    uint256 public orderCount;
    mapping(uint256 => Order) public orders;

    event OrderRecorded(
        uint256 orderId,
        uint256 productId,
        uint256 amountVND,
        address buyer,
        string offchainTx
    );

    function recordOrder(
        uint256 productId,
        uint256 amountVND,
        address buyer,
        string memory offchainTx
    ) external onlyOwner {
        orderCount++;
        orders[orderCount] = Order(
            orderCount,
            productId,
            amountVND,
            buyer,
            offchainTx,
            block.timestamp
        );

        emit OrderRecorded(
            orderCount,
            productId,
            amountVND,
            buyer,
            offchainTx
        );
    }
}
