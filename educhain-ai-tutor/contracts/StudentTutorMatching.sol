// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./TutorRegistry.sol";

/**
 * @title StudentTutorMatching
 * @dev Contract for matching students with AI tutors based on learning needs
 */
contract StudentTutorMatching {
    // Struct to store student information
    struct Student {
        address studentAddress;
        string[] subjects;
        uint256[] learningPreferences;
        uint256 registeredAt;
        bool isActive;
    }
    
    // Struct to store session information
    struct Session {
        uint256 sessionId;
        address student;
        uint256 tutorId;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool isCompleted;
        uint256 rating;
    }
    
    // Reference to the TutorRegistry contract
    TutorRegistry public tutorRegistry;
    
    // Mapping from student address to Student struct
    mapping(address => Student) public students;
    
    // Mapping from session ID to Session struct
    mapping(uint256 => Session) public sessions;
    
    // Total number of sessions
    uint256 public sessionCount;
    
    // Events
    event StudentRegistered(address indexed student, string[] subjects);
    event SessionStarted(uint256 indexed sessionId, address indexed student, uint256 indexed tutorId);
    event SessionEnded(uint256 indexed sessionId, uint256 duration);
    event SessionRated(uint256 indexed sessionId, uint256 rating);
    
    /**
     * @dev Constructor sets the TutorRegistry contract address
     * @param _tutorRegistryAddress Address of the TutorRegistry contract
     */
    constructor(address _tutorRegistryAddress) {
        tutorRegistry = TutorRegistry(_tutorRegistryAddress);
    }
    
    /**
     * @dev Register a new student
     * @param _subjects Array of subjects the student is interested in
     * @param _learningPreferences Array of learning preferences (encoded as integers)
     */
    function registerStudent(
        string[] memory _subjects,
        uint256[] memory _learningPreferences
    ) external {
        require(_subjects.length > 0, "Must specify at least one subject");
        require(_learningPreferences.length > 0, "Must specify at least one learning preference");
        
        students[msg.sender] = Student({
            studentAddress: msg.sender,
            subjects: _subjects,
            learningPreferences: _learningPreferences,
            registeredAt: block.timestamp,
            isActive: true
        });
        
        emit StudentRegistered(msg.sender, _subjects);
    }
    
    /**
     * @dev Update student information
     * @param _subjects New array of subjects
     * @param _learningPreferences New array of learning preferences
     */
    function updateStudent(
        string[] memory _subjects,
        uint256[] memory _learningPreferences
    ) external {
        require(students[msg.sender].isActive, "Student not registered or inactive");
        require(_subjects.length > 0, "Must specify at least one subject");
        require(_learningPreferences.length > 0, "Must specify at least one learning preference");
        
        Student storage student = students[msg.sender];
        student.subjects = _subjects;
        student.learningPreferences = _learningPreferences;
    }
    
    /**
     * @dev Start a tutoring session with a specific tutor
     * @param _tutorId ID of the tutor to start a session with
     * @return sessionId ID of the newly created session
     */
    function startSession(uint256 _tutorId) external returns (uint256 sessionId) {
        require(students[msg.sender].isActive, "Student not registered or inactive");
        
        // Get tutor information to verify it's active
        TutorRegistry.Tutor memory tutor = tutorRegistry.getTutor(_tutorId);
        require(tutor.isActive, "Tutor is not active");
        
        sessionId = sessionCount;
        
        sessions[sessionId] = Session({
            sessionId: sessionId,
            student: msg.sender,
            tutorId: _tutorId,
            startTime: block.timestamp,
            endTime: 0,
            isActive: true,
            isCompleted: false,
            rating: 0
        });
        
        sessionCount++;
        
        emit SessionStarted(sessionId, msg.sender, _tutorId);
        
        return sessionId;
    }
    
    /**
     * @dev End an active tutoring session
     * @param _sessionId ID of the session to end
     */
    function endSession(uint256 _sessionId) external {
        Session storage session = sessions[_sessionId];
        
        require(session.student == msg.sender, "Only the student can end their session");
        require(session.isActive, "Session is not active");
        require(!session.isCompleted, "Session is already completed");
        
        session.isActive = false;
        session.isCompleted = true;
        session.endTime = block.timestamp;
        
        uint256 duration = session.endTime - session.startTime;
        
        // Record that the tutor helped a student
        tutorRegistry.recordStudentHelped(session.tutorId);
        
        emit SessionEnded(_sessionId, duration);
    }
    
    /**
     * @dev Rate a completed tutoring session
     * @param _sessionId ID of the session to rate
     * @param _rating Rating from 1-100
     */
    function rateSession(uint256 _sessionId, uint256 _rating) external {
        require(_rating >= 1 && _rating <= 100, "Rating must be between 1 and 100");
        
        Session storage session = sessions[_sessionId];
        
        require(session.student == msg.sender, "Only the student can rate their session");
        require(session.isCompleted, "Session must be completed before rating");
        require(session.rating == 0, "Session has already been rated");
        
        session.rating = _rating;
        
        // Rate the tutor
        tutorRegistry.rateTutor(session.tutorId, _rating);
        
        emit SessionRated(_sessionId, _rating);
    }
    
    /**
     * @dev Find the best tutor match for a student based on subject
     * @param _subject Subject to find a tutor for
     * @return tutorId ID of the best matching tutor
     */
    function findBestTutorMatch(string memory _subject) external view returns (uint256) {
        uint256[] memory activeTutorIds = tutorRegistry.getActiveTutors();
        
        uint256 bestTutorId = 0;
        uint256 highestRating = 0;
        
        for (uint256 i = 0; i < activeTutorIds.length; i++) {
            TutorRegistry.Tutor memory tutor = tutorRegistry.getTutor(activeTutorIds[i]);
            
            // Simple string comparison - in a real implementation, we would use more sophisticated matching
            if (keccak256(bytes(tutor.subject)) == keccak256(bytes(_subject))) {
                if (tutor.satisfactionRating > highestRating) {
                    highestRating = tutor.satisfactionRating;
                    bestTutorId = activeTutorIds[i];
                }
            }
        }
        
        return bestTutorId;
    }
    
    /**
     * @dev Get all sessions for a student
     * @param _student Address of the student
     * @return Array of session IDs
     */
    function getStudentSessions(address _student) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count sessions for this student
        for (uint256 i = 0; i < sessionCount; i++) {
            if (sessions[i].student == _student) {
                count++;
            }
        }
        
        // Create array of session IDs
        uint256[] memory studentSessionIds = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < sessionCount; i++) {
            if (sessions[i].student == _student) {
                studentSessionIds[index] = i;
                index++;
            }
        }
        
        return studentSessionIds;
    }
}

