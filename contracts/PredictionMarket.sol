//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import './ESDToken.sol';

contract PredictionMarket {
    enum Side {
        Biden,
        Trump
    }
    struct Result {
        Side winner;
        Side loser;
    }
    Result result;
    bool electionFinished;
    address tokenAddress;

    mapping(Side => uint256) public bets;
    mapping(address => mapping(Side => uint256)) public betsPerGambler;
    address public oracle;

    constructor(address _oracle, address _tokenAddress) {
        oracle = _oracle;
        tokenAddress = _tokenAddress;
    }

    function setTokenAddress(address _tokenAddress) external {
        tokenAddress = _tokenAddress;
    }

    function placeBet(Side _side, uint256 amount) external {
        // require(electionFinished == false, "election is finished");
        // IESDToken(tokenAddress).transferTo(address(this), amount);
        // tokenAddress.delegatecall(abi.encodeWithSelector(IESDToken.transferTo.selector, address(this), amount));
        console.log("Placing bet: ", amount);
        // (bool success, bytes memory data) = tokenAddress.delegatecall(
        //     abi.encodeWithSignature(
        //         "transferTo(address, uint256)",
        //         address(this),
        //         amount
        //     )
        // );
        // require(success == false, "Transaction failed");
        IESDToken(tokenAddress).transferTo(msg.sender, amount);
        bets[_side] += amount;
        betsPerGambler[msg.sender][_side] += amount;
    }

    function withdrawGain() external {
        uint256 gamblerBet = betsPerGambler[msg.sender][result.winner];
        console.log("Winnings: ", gamblerBet);
        require(gamblerBet > 0, "you do not have any winning bet");
        // require(electionFinished == true, "election not finished yet");
        // address payable winner = payable(msg.sender);
        uint256 gain = gamblerBet +
            (bets[result.loser] * gamblerBet) /
            bets[result.winner];
        betsPerGambler[msg.sender][Side.Biden] = 0;
        betsPerGambler[msg.sender][Side.Trump] = 0;
        console.log("Transferring %s to %s: ", gain, msg.sender);
        IESDToken(tokenAddress).transferTo(msg.sender, gain);
    }

    function reportResult(Side _winner, Side _loser) external {
        // require(oracle == msg.sender, "only oracle");
        result.winner = _winner;
        result.loser = _loser;
        // electionFinished = true;
    }
}

interface IESDToken {
    function _transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) external;

    function approveTx(address _spender, uint256 _amount) external;

    function allow(address _from, address _to) external view;

    function transferTo(address _to, uint256 _amount) external;
}
