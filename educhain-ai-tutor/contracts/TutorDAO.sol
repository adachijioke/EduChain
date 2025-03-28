// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TutorDAO
 * @dev Governance contract for the AI Tutor DAO
 */
contract TutorDAO {
    // Struct to store proposal information
    struct Proposal {
        uint256 proposalId;
        address proposer;
        string title;
        string description;
        bytes callData;
        address targetContract;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool passed;
    }
    
    // Token address for governance
    address public tokenAddress;
    
    // Mapping from proposal ID to Proposal struct
    mapping(uint256 => Proposal) public proposals;
    
    // Total number of proposals
    uint256 public proposalCount;
    
    // Mapping from proposal ID to voter address to whether they have voted
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // Minimum voting period (in seconds)
    uint256 public minVotingPeriod = 3 days;
    
    // Minimum votes required for a proposal to pass
    uint256 public minVotesRequired;
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    
    /**
     * @dev Constructor sets the token address and minimum votes required
     * @param _tokenAddress Address of the governance token
     * @param _minVotesRequired Minimum votes required for a proposal to pass
     */
    constructor(address _tokenAddress, uint256 _minVotesRequired) {
        tokenAddress = _tokenAddress;
        minVotesRequired = _minVotesRequired;
    }
    
    /**
     * @dev Create a new governance proposal
     * @param _title Title of the proposal
     * @param _description Detailed description of the proposal
     * @param _callData Function call data to execute if the proposal passes
     * @param _targetContract Address of the contract to call
     * @param _votingPeriod Duration of the voting period in seconds
     * @return proposalId ID of the newly created proposal
     */
    function createProposal(
        string memory _title,
        string memory _description,
        bytes memory _callData,
        address _targetContract,
        uint256 _votingPeriod
    ) external returns (uint256 proposalId) {
        require(_votingPeriod >= minVotingPeriod, "Voting period too short");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_targetContract != address(0), "Target contract cannot be zero address");
        
        proposalId = proposalCount;
        
        proposals[proposalId] = Proposal({
            proposalId: proposalId,
            proposer: msg.sender,
            title: _title,
            description: _description,
            callData: _callData,
            targetContract: _targetContract,
            votesFor: 0,
            votesAgainst: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + _votingPeriod,
            executed: false,
            passed: false
        });
        
        proposalCount++;
        
        emit ProposalCreated(proposalId, msg.sender, _title);
        
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     * @param _proposalId ID of the proposal to vote on
     * @param _support Whether to vote for or against the proposal
     * @param _voteWeight Weight of the vote (based on token balance)
     */
    function castVote(uint256 _proposalId, bool _support, uint256 _voteWeight) external {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp < proposal.endTime, "Voting period has ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted on this proposal");
        
        // In a real implementation, we would verify the voter's token balance
        // For example:
        // require(IERC20(tokenAddress).balanceOf(msg.sender) >= _voteWeight, "Insufficient voting power");
        
        if (_support) {
            proposal.votesFor += _voteWeight;
        } else {
            proposal.votesAgainst += _voteWeight;
        }
        
        hasVoted[_proposalId][msg.sender] = true;
        
        emit VoteCast(_proposalId, msg.sender, _support, _voteWeight);
    }
    
    /**
     * @dev Execute a proposal after the voting period has ended
     * @param _proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp >= proposal.endTime, "Voting period has not ended");
        require(!proposal.executed, "Proposal has already been executed");
        require(proposal.votesFor + proposal.votesAgainst >= minVotesRequired, "Not enough votes");
        
        proposal.executed = true;
        
        if (proposal.votesFor > proposal.votesAgainst) {
            proposal.passed = true;
            
            // Execute the proposal
            (bool success, ) = proposal.targetContract.call(proposal.callData);
            require(success, "Proposal execution failed");
        }
        
        emit ProposalExecuted(_proposalId, proposal.passed);
    }
    
    /**
     * @dev Get proposal details
     * @param _proposalId ID of the proposal
     * @return Proposal details
     */
    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }
    
    /**
     * @dev Update the minimum voting period
     * @param _newMinVotingPeriod New minimum voting period in seconds
     */
    function updateMinVotingPeriod(uint256 _newMinVotingPeriod) external {
        // In a real implementation, this would be restricted to the DAO itself
        minVotingPeriod = _newMinVotingPeriod;
    }
    
    /**
     * @dev Update the minimum votes required
     * @param _newMinVotesRequired New minimum votes required
     */
    function updateMinVotesRequired(uint256 _newMinVotesRequired) external {
        // In a real implementation, this would be restricted to the DAO itself
        minVotesRequired = _newMinVotesRequired;
    }
}

