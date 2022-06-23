//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract ESDToken is ERC20 {
    address private admin;

    constructor(uint256 _initialSupply, address _admin)
        ERC20("ESD Token", "ESD")
    {
        admin = _admin;
        _mint(msg.sender, toESDwei(_initialSupply));
    }

    modifier onlyOwner() {
        require(msg.sender == admin, "Admin only operation");
        _;
    }

    //can be a public function
    function toESDwei(uint256 _ESD) internal view returns (uint256) {
        return _ESD * 10**decimals();
    }

    function mintESD(uint256 _amount) external onlyOwner {
        _mint(msg.sender, toESDwei(_amount));
    }

    //external tranfer fn
    function transferTo(address _to, uint256 _amount) external {
        console.log("Transferring %s to %s", _amount, _to);
        console.log("Sender: ", msg.sender);
        _transfer(_to,msg.sender, toESDwei(_amount));
    }

    //external _transerFrom
    function _transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) external {
        transferFrom(_from, _to, toESDwei(_amount));
    }

    //external approve
    function approveTx(address _spender, uint256 _amount) external {
        approve(_spender, toESDwei(_amount));
    }

    //override decimal
    function decimals() public view virtual override returns (uint8) {
        return 10;
    }
}