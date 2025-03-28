// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EduToken
 * @dev ERC20 token for the EduChain AI Tutor DAO ecosystem
 */
contract EduToken {
    string public name = "EduChain Token";
    string public symbol = "EDU";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    // DAO address for governance
    address public daoAddress;
    
    // Mapping from address to balance
    mapping(address => uint256) public balanceOf;
    
    // Mapping from address to mapping of spender to allowance
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    
    // Modifiers
    modifier onlyDAO() {
        require(msg.sender == daoAddress, "Only DAO can call this function");
        _;
    }
    
    /**
     * @dev Constructor sets the DAO address and mints initial supply
     * @param _daoAddress Address of the DAO
     * @param _initialSupply Initial token supply to mint
     */
    constructor(address _daoAddress, uint256 _initialSupply) {
        daoAddress = _daoAddress;
        
        // Mint initial supply to the DAO
        _mint(_daoAddress, _initialSupply);
    }
    
    /**
     * @dev Transfer tokens to a specified address
     * @param _to Address to transfer to
     * @param _value Amount to transfer
     * @return success Whether the transfer was successful
     */
    function transfer(address _to, uint256 _value) external returns (bool success) {
        require(_to != address(0), "Cannot transfer to zero address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        
        return true;
    }
    
    /**
     * @dev Approve a spender to spend tokens on behalf of the sender
     * @param _spender Address to approve
     * @param _value Amount to approve
     * @return success Whether the approval was successful
     */
    function approve(address _spender, uint256 _value) external returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        
        emit Approval(msg.sender, _spender, _value);
        
        return true;
    }
    
    /**
     * @dev Transfer tokens from one address to another
     * @param _from Address to transfer from
     * @param _to Address to transfer to
     * @param _value Amount to transfer
     * @return success Whether the transfer was successful
     */
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success) {
        require(_to != address(0), "Cannot transfer to zero address");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        
        return true;
    }
    
    /**
     * @dev Mint new tokens (only callable by the DAO)
     * @param _to Address to mint tokens to
     * @param _value Amount to mint
     */
    function mint(address _to, uint256 _value) external onlyDAO {
        _mint(_to, _value);
    }
    
    /**
     * @dev Internal function to mint tokens
     * @param _to Address to mint tokens to
     * @param _value Amount to mint
     */
    function _mint(address _to, uint256 _value) internal {
        require(_to != address(0), "Cannot mint to zero address");
        
        totalSupply += _value;
        balanceOf[_to] += _value;
        
        emit Transfer(address(0), _to, _value);
        emit Mint(_to, _value);
    }
    
    /**
     * @dev Burn tokens (only callable by the DAO)
     * @param _from Address to burn tokens from
     * @param _value Amount to burn
     */
    function burn(address _from, uint256 _value) external onlyDAO {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        
        balanceOf[_from] -= _value;
        totalSupply -= _value;
        
        emit Transfer(_from, address(0), _value);
        emit Burn(_from, _value);
    }
    
    /**
     * @dev Update the DAO address
     * @param _newDaoAddress New DAO address
     */
    function updateDaoAddress(address _newDaoAddress) external onlyDAO {
        daoAddress = _newDaoAddress;
    }
}

