// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
    =====================================================
    SMART CONTRACT: WARRANTY MANAGER
    -----------------------------------------------------
    Mục đích:
    - Quản lý bảo hành điện tử cho sản phẩm
    - Mỗi sản phẩm sau khi bán sẽ có 1 Warranty ID on-chain
    - Blockchain dùng để đảm bảo:
        + Minh bạch
        + Không chỉnh sửa
        + Chuyển quyền sở hữu
    =====================================================
*/

contract WarrantyManager {

    /*
        -------------------------------------------------
        STRUCT: Warranty
        -------------------------------------------------
        warrantyId     : ID bảo hành (tăng dần)
        productId      : ID sản phẩm (off-chain)
        owner          : Chủ sở hữu hiện tại
        startDate      : Thời điểm bắt đầu bảo hành (timestamp)
        endDate        : Thời điểm kết thúc bảo hành (timestamp)
        isActive       : Bảo hành còn hiệu lực hay không
    */
    struct Warranty {
        uint256 warrantyId;
        uint256 productId;
        address owner;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
    }

    // Biến đếm số lượng bảo hành
    uint256 public warrantyCount;

    // Mapping: warrantyId => Warranty
    mapping(uint256 => Warranty) public warranties;

    // Mapping: owner => list warrantyId
    mapping(address => uint256[]) private ownerWarranties;

    /*
        -------------------------------------------------
        EVENTS – DÙNG ĐỂ LOG MINH BẠCH
        -------------------------------------------------
    */
    event WarrantyCreated(
        uint256 indexed warrantyId,
        uint256 productId,
        address owner,
        uint256 startDate,
        uint256 endDate
    );

    event OwnershipTransferred(
        uint256 indexed warrantyId,
        address oldOwner,
        address newOwner
    );

    event WarrantyExpired(uint256 indexed warrantyId);

    /*
        -------------------------------------------------
        MODIFIER: chỉ chủ sở hữu bảo hành
        -------------------------------------------------
    */
    modifier onlyWarrantyOwner(uint256 _warrantyId) {
        require(
            warranties[_warrantyId].owner == msg.sender,
            "You are not the warranty owner"
        );
        _;
    }

    /*
        =================================================
        FUNCTION: createWarranty
        -------------------------------------------------
        Gọi khi:
        - Khách mua sản phẩm thành công
        - Backend gọi hàm này
        -------------------------------------------------
        _productId      : ID sản phẩm (DB)
        _customer       : Địa chỉ ví khách hàng
        _warrantyDays   : Số ngày bảo hành
        =================================================
    */
    function createWarranty(
        uint256 _productId,
        address _customer,
        uint256 _warrantyDays
    ) external {

        require(_customer != address(0), "Invalid customer address");
        require(_warrantyDays > 0, "Warranty days must be > 0");

        warrantyCount++;

        uint256 start = block.timestamp;
        uint256 end = start + (_warrantyDays * 1 days);

        warranties[warrantyCount] = Warranty({
            warrantyId: warrantyCount,
            productId: _productId,
            owner: _customer,
            startDate: start,
            endDate: end,
            isActive: true
        });

        ownerWarranties[_customer].push(warrantyCount);

        emit WarrantyCreated(
            warrantyCount,
            _productId,
            _customer,
            start,
            end
        );
    }

    /*
        =================================================
        FUNCTION: getWarranty
        -------------------------------------------------
        Lấy thông tin bảo hành theo ID
        =================================================
    */
    function getWarranty(uint256 _warrantyId)
        external
        view
        returns (
            uint256 warrantyId,
            uint256 productId,
            address owner,
            uint256 startDate,
            uint256 endDate,
            bool isActive
        )
    {
        Warranty memory w = warranties[_warrantyId];
        return (
            w.warrantyId,
            w.productId,
            w.owner,
            w.startDate,
            w.endDate,
            w.isActive
        );
    }

    /*
        =================================================
        FUNCTION: isWarrantyValid
        -------------------------------------------------
        Kiểm tra bảo hành còn hiệu lực hay không
        =================================================
    */
    function isWarrantyValid(uint256 _warrantyId)
        external
        view
        returns (bool)
    {
        Warranty memory w = warranties[_warrantyId];

        if (!w.isActive) return false;
        if (block.timestamp > w.endDate) return false;

        return true;
    }

    /*
        =================================================
        FUNCTION: transferWarranty
        -------------------------------------------------
        Chuyển quyền sở hữu bảo hành
        Dùng khi:
        - Bán lại sản phẩm
        =================================================
    */
    function transferWarranty(
        uint256 _warrantyId,
        address _newOwner
    )
        external
        onlyWarrantyOwner(_warrantyId)
    {
        require(_newOwner != address(0), "Invalid new owner");

        address oldOwner = warranties[_warrantyId].owner;
        warranties[_warrantyId].owner = _newOwner;

        ownerWarranties[_newOwner].push(_warrantyId);

        emit OwnershipTransferred(
            _warrantyId,
            oldOwner,
            _newOwner
        );
    }

    /*
        =================================================
        FUNCTION: expireWarranty
        -------------------------------------------------
        Đánh dấu bảo hành hết hạn (optional)
        =================================================
    */
    function expireWarranty(uint256 _warrantyId) external {
        require(
            block.timestamp > warranties[_warrantyId].endDate,
            "Warranty not expired yet"
        );

        warranties[_warrantyId].isActive = false;

        emit WarrantyExpired(_warrantyId);
    }

    /*
        =================================================
        FUNCTION: getMyWarranties
        -------------------------------------------------
        Lấy danh sách warrantyId theo ví
        =================================================
    */
    function getMyWarranties(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        return ownerWarranties[_owner];
    }
}