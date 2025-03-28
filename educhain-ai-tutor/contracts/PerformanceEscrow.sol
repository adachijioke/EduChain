// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./StudentTutorMatching.sol";

/**
 * @title PerformanceEscrow
 * @dev Contract for handling payments based on verified learning outcomes
 */
contract PerformanceEscrow {
    // Reference to the StudentTutorMatching contract
    StudentTutorMatching public matchingContract;
    
    // Token address for payments
    address public tokenAddress;
    
    // DAO address for governance
    address public daoAddress;
    
    // Fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public daoFeePercentage;
    
    // Struct to store payment information
    struct Payment {
        uint256 paymentId;
        uint256 sessionId;
        address student;
        uint256 tutorId;
        uint256 amount;
        bool isReleased;
        uint256 createdAt;
        uint256 releasedAt;
    }
    
    // Mapping from payment ID to Payment struct
    mapping(uint256 => Payment) public payments;
    
    // Total number of payments
    uint256 public paymentCount;
    
    // Events
    event PaymentCreated(uint256 indexed paymentId, uint256 indexed sessionId, uint256 amount);
    event PaymentReleased(uint256 indexed paymentId, uint256 tutorFee, uint256 daoFee);
    
    // Modifiers
    modifier onlyDAO() {
        require(msg.sender == daoAddress, "Only DAO can call this function");
        _;
    }
    
    /**
     * @dev Constructor sets the contract addresses and fee percentage
     * @param _matchingContractAddress Address of the StudentTutorMatching contract
     * @param _tokenAddress Address of the token used for payments
     * @param _daoAddress Address of the DAO
     * @param _daoFeePercentage Fee percentage for the DAO (in basis points)
     */
    constructor(
        address _matchingContractAddress,
        address _tokenAddress,
        address _daoAddress,
        uint256 _daoFeePercentage
    ) {
        matchingContract = StudentTutorMatching(_matchingContractAddress);
        tokenAddress = _tokenAddress;
        daoAddress = _daoAddress;
        daoFeePercentage = _daoFeePercentage;
    }
    
    /**
     * @dev Create a new payment for a session
     * @param _sessionId ID of the session
     * @param _amount Amount to be paid
     * @return paymentId ID of the newly created payment
     */
    function createPayment(uint256 _sessionId, uint256 _amount) external returns (uint256 paymentId) {
        // Get session information
        StudentTutorMatching.Session memory session = matchingContract.sessions(_sessionId);
        
        require(session.isCompleted, "Session must be completed");
        require(!session.isActive, "Session must not be active");
        require(session.rating > 0, "Session must be rated");
        
        paymentId = paymentCount;
        
        payments[paymentId] = Payment({
            paymentId: paymentId,
            sessionId: _sessionId,
            student: session.student,
            tutorId: session.tutorId,
            amount: _amount,
            isReleased: false,
            createdAt: block.timestamp,
            releasedAt: 0
        });
        
        paymentCount++;
        
        emit PaymentCreated(paymentId, _sessionId, _amount);
        
        return paymentId;
    }
    
    /**
     * @dev Release payment for a completed session
     * @param _paymentId ID of the payment to release
     */
    function releasePayment(uint256 _paymentId) external {
        Payment storage payment = payments[_paymentId];
        
        require(!payment.isReleased, "Payment has already been released");
        
        // Get session information to verify it's completed and rated
        StudentTutorMatching.Session memory session = matchingContract.sessions(payment.sessionId);
        require(session.isCompleted, "Session must be completed");
        require(session.rating > 0, "Session must be rated");
        
        // Calculate fees
        uint256 daoFee = (payment.amount * daoFeePercentage) / 10000;
        uint256 tutorFee = payment.amount - daoFee;
        
        // Mark payment as released
        payment.isReleased = true;
        payment.releasedAt = block.timestamp;
        
        // In a real implementation, we would transfer tokens here
        // For example:
        // IERC20(tokenAddress).transferFrom(msg.sender, tutorOwnerAddress, tutorFee);
        // IERC20(tokenAddress).transferFrom(msg.sender, daoAddress, daoFee);
        
        emit PaymentReleased(_paymentId, tutorFee, daoFee);
    }
    
    /**
     * @dev Update the DAO fee percentage
     * @param _newFeePercentage New fee percentage (in basis points)
     */
    function updateDaoFeePercentage(uint256 _newFeePercentage) external onlyDAO {
        require(_newFeePercentage <= 1000, "Fee percentage cannot exceed 10%");
        daoFeePercentage = _newFeePercentage;
    }
    
    /**
     * @dev Update the DAO address
     * @param _newDaoAddress New DAO address
     */
    function updateDaoAddress(address _newDaoAddress) external onlyDAO {
        daoAddress = _newDaoAddress;
    }
    
    /**
     * @dev Update the token address
     * @param _newTokenAddress New token address
     */
    function updateTokenAddress(address _newTokenAddress) external onlyDAO {
        tokenAddress = _newTokenAddress;
    }
    
    /**
     * @dev Get all payments for a student
     * @param _student Address of the student
     * @return Array of payment IDs
     */
    function getStudentPayments(address _student) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count payments for this student
        for (uint256 i = 0; i < paymentCount; i++) {
            if (payments[i].student == _student) {
                count++;
            }
        }
        
        // Create array of payment IDs
        uint256[] memory studentPaymentIds = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < paymentCount; i++) {
            if (payments[i].student == _student) {
                studentPaymentIds[index] = i;
                index++;
            }
        }
        
        return studentPaymentIds;
    }
}

