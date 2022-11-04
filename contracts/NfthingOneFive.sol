// SPDX-License-Identifier: None

pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NfthingOneFive is ERC1155Supply, Ownable{
    
    uint256[] public maxPerUser = [1, 5];
    uint256[] public supply = [20, 1000];
    uint256[] public mintPrice = [0.002 ether, 0.001 ether];    
    bool public paused = false; 
    string public uriPrefix = "";
    mapping(address => bool) public allowList;

    constructor(
        string memory _uri
    ) ERC1155(_uri){
        uriPrefix = _uri;
    }

    modifier checkSupply(uint256 _id, uint256 _amount){
        require(totalSupply(_id) + _amount <= supply[_id], "Max supply reached!");
        _;
    }

    modifier isPaused(){
        require(!paused, "The Contract is paused!");
        _;
    }
    
    modifier checkCost(uint256 _id, uint256 _amount){
        require(msg.value >= mintPrice[_id] * _amount, "Mint amount not appropriate");
        _;
    }

    modifier checkBalanceOf(uint256 _id, uint256 _amount){
        require(balanceOf(msg.sender, _id) + _amount <= maxPerUser[_id], "Already reached maximum amount for this item");
        _;
    }

    modifier isAllowListed(address _address){
        require(allowList[_address], "User not whitelisted!");
        _;
    }

    function mint(uint256 _amount, uint256 _id) payable public 
    isPaused
    checkSupply(_id, _amount)
    checkCost(_id, _amount)
    checkBalanceOf(_id, _amount)
    { 
        _mint(msg.sender, _id, _amount, "");
    }

    function mintForWhitelist(uint256 _amount, uint256 _id) payable public
    isPaused
    checkSupply(_id, _amount)
    checkBalanceOf(_id, _amount)
    isAllowListed(msg.sender)
    {
        _mint(msg.sender, _id, _amount, "");
    }

    function uri(uint256 _tokenId) override public view returns(string memory){
        return string(
            abi.encodePacked(
                "https://bafybeib4tnidedb44fm67gtzcyovsus5uwr3m3inj5eqbxrgkpw7zo5rii.ipfs.dweb.link/metadata/",
                Strings.toString(_tokenId),
                ".json"
            )
        );
    }

    function setMaxPerUser(uint256 _id, uint256 _amount) 
    public
    onlyOwner
    {
        maxPerUser[_id] = _amount;
    }

    function setAllowListUser(address _address)
    public
    onlyOwner
    {
        allowList[_address] = true;
    }

    function removeAllowlistUser(address _address)
    public
    onlyOwner
    {
        allowList[_address] = false;
    }

    function setSupply(uint256 _id, uint256 _supply)
    public
    onlyOwner
    {
        supply[_id] = _supply;
    }

    function setMintPrice(uint256 _id, uint256 _price)
    public
    onlyOwner
    {
        mintPrice[_id] = _price;
    }

    function setPaused(bool _paused)
    public
    onlyOwner
    {
        paused = _paused;
    }

    function setUriPrefix(string memory _uriPrefix)
    public
    onlyOwner
    {
        uriPrefix = _uriPrefix;       
    }

}