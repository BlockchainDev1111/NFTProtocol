pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenERC20 is ERC20, Ownable{
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {}

    function mint( address recipient, uint amount) external onlyOwner{
        _mint(recipient, amount);
    }
}