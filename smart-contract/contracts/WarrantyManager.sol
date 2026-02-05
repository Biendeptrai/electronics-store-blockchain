// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WarrantyManager {

        address public owner; // 👈 ADMIN

    constructor() {
        owner = msg.sender; // ví deploy là admin
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin");
        _;
    }

    address public owner; // 👈 ADMIN

    constructor() {
        owner = msg.sender; // ví deploy là admin
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin");
        _;
    }

    struct Order {
        uint orderId;
        uint productId;
        uint amountVND;
        address buyer;
        uint createdAt;
    }

    uint public orderCount;
    mapping(uint => Order) private orders;

    function createOrder(uint _productId, uint _amountVND) public {
        orderCount++;

        orders[orderCount] = Order({
            orderId: orderCount,
            productId: _productId,
            amountVND: _amountVND,
            buyer: msg.sender,
            createdAt: block.timestamp
        });
    }

    function getOrderByIndex(uint _index)
        public
        view
        returns (
            uint,
            uint,
            uint,
            address,
            uint
        )
    {
        Order memory o = orders[_index];
        return (
            o.orderId,
            o.productId,
            o.amountVND,
            o.buyer,
            o.createdAt
        );
    }

    // 🔐 ADMIN FUNCTION (demo)
    function adminResetOrders() public onlyOwner {
        orderCount = 0;
    }
}