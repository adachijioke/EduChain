// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TutorRegistry
 * @dev Contract for registering and managing AI tutors in the EduChain AI Tutor DAO
 */
contract TutorRegistry {
    // Struct to store tutor information
    struct Tutor {
        string name;
        string subject;
        string description;
        address owner;
        uint256 satisfactionRating;
        uint256 totalRatings;
        uint256 studentsHelped;
        bool isActive;
        uint256 createdAt;
    }

    // Mapping from tutor ID to Tutor struct
    mapping(uint256 => Tutor) public tutors;
    
    // Total number of tutors
    uint256 public tutorCount;
    
    // DAO address that can govern the registry
    address public daoAddress;
    
    // Events
    event TutorRegistered(uint256 indexed tutorId, string name, string subject, address owner);
    event TutorUpdated(uint256 indexed tutorId, string name, string subject);
    event TutorStatusChanged(uint256 indexed tutorId, bool isActive);
    event TutorRated(uint256 indexed tutorId, uint256 rating);
    
    // Modifiers
    modifier onlyDAO() {
        require(msg.sender == daoAddress, "Only DAO can call this function");
        _;
    }
    
    modifier onlyTutorOwner(uint256 _tutorId) {
        require(msg.sender == tutors[_tutorId].owner, "Only tutor owner can call this function");
        _;
    }
    
    /**
     * @dev Constructor sets the DAO address
     * @param _daoAddress Address of the DAO contract
     */
    constructor(address _daoAddress) {
        daoAddress = _daoAddress;
    }
    
    /**
     * @dev Register a new AI tutor
     * @param _name Name of the tutor
     * @param _subject Subject specialization
     * @param _description Detailed description of the tutor
     * @return tutorId ID of the newly registered tutor
     */
    function registerTutor(
        string memory _name,
        string memory _subject,
        string memory _description
    ) external returns (uint256 tutorId) {
        tutorId = tutorCount;
        
        tutors[tutorId] = Tutor({
            name: _name,
            subject: _subject,
            description: _description,
            owner: msg.sender,
            satisfactionRating: 0,
            totalRatings: 0,
            studentsHelped: 0,
            isActive: true,
            createdAt: block.timestamp
        });
        
        tutorCount++;
        
        emit TutorRegistered(tutorId, _name, _subject, msg.sender);
        
        return tutorId;
    }
    
    /**
     * @dev Update tutor information
     * @param _tutorId ID of the tutor to update
     * @param _name New name
     * @param _subject New subject
     * @param _description New description
     */
    function updateTutor(
        uint256 _tutorId,
        string memory _name,
        string memory _subject,
        string memory _description
    ) external onlyTutorOwner(_tutorId) {
        Tutor storage tutor = tutors[_tutorId];
        
        tutor.name = _name;
        tutor.subject = _subject;
        tutor.description = _description;
        
        emit TutorUpdated(_tutorId, _name, _subject);
    }
    
    /**
     * @dev Change the active status of a tutor
     * @param _tutorId ID of the tutor
     * @param _isActive New active status
     */
    function setTutorStatus(uint256 _tutorId, bool _isActive) 
        external onlyTutorOwner(_tutorId) 
    {
        tutors[_tutorId].isActive = _isActive;
        
        emit TutorStatusChanged(_tutorId, _isActive);
    }
    
    /**
     * @dev Rate a tutor after a session
     * @param _tutorId ID of the tutor
     * @param _rating Rating from 1-100
     */
    function rateTutor(uint256 _tutorId, uint256 _rating) external {
        require(_rating >= 1 && _rating <= 100, "Rating must be between 1 and 100");
        require(tutors[_tutorId].isActive, "Tutor is not active");
        
        Tutor storage tutor = tutors[_tutorId];
        
        // Update the satisfaction rating
        uint256 totalPoints = tutor.satisfactionRating * tutor.totalRatings;
        totalPoints += _rating;
        tutor.totalRatings++;
        tutor.satisfactionRating = totalPoints / tutor.totalRatings;
        
        emit TutorRated(_tutorId, _rating);
    }
    
    /**
     * @dev Record that a tutor has helped a student
     * @param _tutorId ID of the tutor
     */
    function recordStudentHelped(uint256 _tutorId) external {
        require(tutors[_tutorId].isActive, "Tutor is not active");
        
        tutors[_tutorId].studentsHelped++;
    }
    
    /**
     * @dev Get tutor details
     * @param _tutorId ID of the tutor
     * @return Tutor details
     */
    function getTutor(uint256 _tutorId) external view returns (Tutor memory) {
        return tutors[_tutorId];
    }
    
    /**
     * @dev Get all active tutors
     * @return Array of active tutor IDs
     */
    function getActiveTutors() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active tutors
        for (uint256 i = 0; i < tutorCount; i++) {
            if (tutors[i].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active tutor IDs
        uint256[] memory activeTutorIds = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < tutorCount; i++) {
            if (tutors[i].isActive) {
                activeTutorIds[index] = i;
                index++;
            }
        }
        
        return activeTutorIds;
    }
    
    /**
     * @dev Update the DAO address
     * @param _newDaoAddress New DAO address
     */
    function updateDaoAddress(address _newDaoAddress) external onlyDAO {
        daoAddress = _newDaoAddress;
    }
}

