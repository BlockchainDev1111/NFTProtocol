pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract TokenERC721 is ERC721, Ownable{
    uint256 public totalSupply;
    uint256 public price;
    address public beneficiary;
    IERC20 public token;

    constructor(address _beneficiary,address _token,uint256 _initialPrice,string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        beneficiary = _beneficiary;
        token = IERC20(_token);
        price = _initialPrice;
    }

    function buyNFTs(uint amount) external {
        uint amountToPay = amount * price;

        for(uint i = 0; i < amount; i++) {
            _buyOneNFT(msg.sender,amountToPay);
        }
    }

    function _buyOneNFT(address _receipient,uint _price) internal {
        token.transferFrom(msg.sender, address(this), _price);
        _mint(_receipient, totalSupply);
        totalSupply = totalSupply + 1;
    }

    function setPrice(uint _price) external onlyOwner{
        price = _price;
    }

}
