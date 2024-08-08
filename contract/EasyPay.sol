// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "interfaces/IERC20.sol";

contract EasyPay {
  address public USDT; // 0xd9145CCE52D386f254917e481eB44e9943F39138

  enum Status {
    PENDING,
    PAID,
    COMPLETED,
    CANCELLED
  }

  struct Listing {
    bytes32 id;
    address seller;
    address buyer;
    uint256 rate;
    uint quantity;
    Status status;
  }

  mapping(bytes32 => mapping(address => Listing)) public listings;

  // Additional data structures to keep track of id keys
  bytes32[] listingKeys;
  mapping(address => bytes32[]) addressToListing;

  event newListing(
    bytes32 indexed id,
    address indexed seller,
    uint256 rate,
    uint256 quantity
  );

  event ListingPaid(
    bytes32 indexed id,
    address indexed seller,
    address indexed buyer,
    uint amount,
    uint quantity
  );

  constructor(address _USDT) {
    USDT = _USDT;
  }

  function addListing(bytes32 _id, uint _rate, uint _quantity) public {
    // Store listing to user
    listings[_id][msg.sender] = Listing({
      id: _id,
      seller: msg.sender,
      buyer: address(0),
      rate: _rate,
      quantity: _quantity,
      status: Status.PENDING
    });

    // If this is a new key, add it to the listingKeys array
    bool isNewBytesKey = true;
    for (uint256 i = 0; i < listingKeys.length; i++) {
      if (listingKeys[i] == _id) {
        isNewBytesKey = false;
        break;
      }
    }
    if (isNewBytesKey) {
      listingKeys.push(_id);
    }

    // If this address has not been associated with this key, add the key
    bool isNewAddressKey = true;
    bytes32[] storage bytesKeys = addressToListing[msg.sender];
    for (uint256 i = 0; i < bytesKeys.length; i++) {
      if (bytesKeys[i] == _id) {
        isNewAddressKey = false;
        break;
      }
    }
    if (isNewAddressKey) {
      addressToListing[msg.sender].push(_id);
    }
  }

  function getListing(
    bytes32 _id,
    address _seller
  ) public view returns (Listing memory) {
    return listings[_id][_seller];
  }

  function getAllListingsForAddress(
    address _seller
  ) public view returns (Listing[] memory) {
    bytes32[] storage bytesKeys = addressToListing[_seller];
    Listing[] memory structs = new Listing[](bytesKeys.length);

    for (uint256 i = 0; i < bytesKeys.length; i++) {
      structs[i] = listings[bytesKeys[i]][_seller];
    }

    return structs;
  }

  function payForListing(
    bytes32 _id,
    address _seller,
    uint _quantity,
    uint _amount
  ) external {
    //retrieve the listing
    Listing storage listing = listings[_id][_seller];

    //calculate price
    uint price = listing.rate * _quantity;

    require(
      listing.status == Status.PENDING || listing.status == Status.PAID,
      "Invalid listing"
    );
    require(_quantity <= listing.quantity, "Invalid quantity");
    require(_amount >= price, "Invalid amount");

    // calculate charge -
    // note: Fastpay only charges on rate, not on quantity for sellers cheaper experience 😊
    uint charge = deductCharge(listing.rate);

    //transfer balance to seller after charge
    IERC20(USDT).transferFrom(msg.sender, listing.seller, price - charge);
    //deduct charge
    IERC20(USDT).transferFrom(msg.sender, address(this), charge);

    listing.buyer = msg.sender;
    listing.quantity -= _quantity;

    if (listing.quantity == 0) {
      listing.status = Status.COMPLETED;
    } else {
      listing.status = Status.PAID;
    }

    emit ListingPaid(_id, _seller, msg.sender, _amount, _quantity);
  }

  function deductCharge(uint256 _amount) internal pure returns (uint256) {
    uint256 fee = _amount / 1000; // 0.1%

    return fee;
  }
}
