// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WarrantyManager {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin");
        _;
    }

    struct Order {
        uint256 orderId;
        uint256 productId;
        uint256 amountVND;
        address buyer;
        uint256 createdAt;
    }

    uint256 public orderCount;
    mapping(uint256 => Order) private orders;

    function createOrder(
        uint256 _productId,
        uint256 _amountVND,
        address _buyer
    ) public onlyOwner {
        orderCount++;

        orders[orderCount] = Order({
            orderId: orderCount,
            productId: _productId,
            amountVND: _amountVND,
            buyer: _buyer,
            createdAt: block.timestamp
        });
    }

    function getOrderByIndex(uint256 _index)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            address,
            uint256
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
}