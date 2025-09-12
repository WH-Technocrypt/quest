// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title WebQuestPlatform
 * @dev Smart contract for the Web Quest social gaming platform
 * Manages user profiles, posts, quests, and XP system
 */
contract WebQuestPlatform is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // Counters for IDs
    Counters.Counter private _postIds;
    Counters.Counter private _questIds;
    Counters.Counter private _userIds;
    
    // Structs
    struct User {
        uint256 id;
        address walletAddress;
        string twitterHandle;
        string username;
        uint256 totalXP;
        uint256 level;
        uint256 postsCount;
        uint256 questsCompleted;
        uint256 joinedAt;
        bool isActive;
    }
    
    struct Post {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
        uint256 retweets;
        uint256 comments;
        uint256 xpReward;
        bool isActive;
    }
    
    struct Quest {
        uint256 id;
        string title;
        string description;
        uint256 xpReward;
        uint256 maxProgress;
        string difficulty; // "easy", "medium", "hard"
        string questType; // "daily", "weekly", "special"
        uint256 timeLimit;
        bool isActive;
    }
    
    struct UserQuest {
        uint256 questId;
        address user;
        uint256 progress;
        uint256 startedAt;
        bool completed;
        bool claimed;
    }
    
    // Mappings
    mapping(address => User) public users;
    mapping(uint256 => Post) public posts;
    mapping(uint256 => Quest) public quests;
    mapping(address => bool) public registeredUsers;
    mapping(uint256 => mapping(address => bool)) public postLikes;
    mapping(uint256 => mapping(address => bool)) public postRetweets;
    mapping(address => mapping(uint256 => UserQuest)) public userQuests;
    mapping(address => uint256[]) public userPostIds;
    mapping(address => uint256[]) public userActiveQuests;
    
    // Arrays for iteration
    address[] public allUsers;
    uint256[] public allPosts;
    uint256[] public allQuests;
    
    // Events
    event UserRegistered(address indexed user, string username, string twitterHandle);
    event PostCreated(uint256 indexed postId, address indexed author, string content, uint256 xpReward);
    event PostLiked(uint256 indexed postId, address indexed user);
    event PostRetweeted(uint256 indexed postId, address indexed user);
    event QuestCreated(uint256 indexed questId, string title, uint256 xpReward);
    event QuestStarted(uint256 indexed questId, address indexed user);
    event QuestCompleted(uint256 indexed questId, address indexed user, uint256 xpEarned);
    event QuestProgressUpdated(uint256 indexed questId, address indexed user, uint256 progress);
    event XPEarned(address indexed user, uint256 amount, string reason);
    event LevelUp(address indexed user, uint256 newLevel);
    
    // Constants
    uint256 public constant XP_PER_LEVEL = 1000;
    uint256 public constant POST_XP_REWARD = 25;
    uint256 public constant LIKE_XP_REWARD = 5;
    uint256 public constant RETWEET_XP_REWARD = 10;
    
    constructor() {}
    
    /**
     * @dev Register a new user
     */
    function registerUser(string memory _username, string memory _twitterHandle) external {
        require(!registeredUsers[msg.sender], "User already registered");
        require(bytes(_username).length > 0, "Username cannot be empty");
        
        _userIds.increment();
        uint256 newUserId = _userIds.current();
        
        users[msg.sender] = User({
            id: newUserId,
            walletAddress: msg.sender,
            twitterHandle: _twitterHandle,
            username: _username,
            totalXP: 0,
            level: 1,
            postsCount: 0,
            questsCompleted: 0,
            joinedAt: block.timestamp,
            isActive: true
        });
        
        registeredUsers[msg.sender] = true;
        allUsers.push(msg.sender);
        
        emit UserRegistered(msg.sender, _username, _twitterHandle);
    }
    
    /**
     * @dev Create a new post
     */
    function createPost(string memory _content) external {
        require(registeredUsers[msg.sender], "User not registered");
        require(bytes(_content).length > 0, "Content cannot be empty");
        require(bytes(_content).length <= 280, "Content too long");
        
        _postIds.increment();
        uint256 newPostId = _postIds.current();
        
        posts[newPostId] = Post({
            id: newPostId,
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            likes: 0,
            retweets: 0,
            comments: 0,
            xpReward: POST_XP_REWARD,
            isActive: true
        });
        
        allPosts.push(newPostId);
        userPostIds[msg.sender].push(newPostId);
        users[msg.sender].postsCount++;
        
        // Award XP for creating post
        _awardXP(msg.sender, POST_XP_REWARD, "Post Creation");
        
        emit PostCreated(newPostId, msg.sender, _content, POST_XP_REWARD);
    }
    
    /**
     * @dev Like a post
     */
    function likePost(uint256 _postId) external {
        require(registeredUsers[msg.sender], "User not registered");
        require(posts[_postId].isActive, "Post does not exist");
        require(!postLikes[_postId][msg.sender], "Already liked");
        require(posts[_postId].author != msg.sender, "Cannot like own post");
        
        postLikes[_postId][msg.sender] = true;
        posts[_postId].likes++;
        
        // Award XP to the person liking
        _awardXP(msg.sender, LIKE_XP_REWARD, "Post Like");
        
        emit PostLiked(_postId, msg.sender);
    }
    
    /**
     * @dev Retweet a post
     */
    function retweetPost(uint256 _postId) external {
        require(registeredUsers[msg.sender], "User not registered");
        require(posts[_postId].isActive, "Post does not exist");
        require(!postRetweets[_postId][msg.sender], "Already retweeted");
        require(posts[_postId].author != msg.sender, "Cannot retweet own post");
        
        postRetweets[_postId][msg.sender] = true;
        posts[_postId].retweets++;
        
        // Award XP to the person retweeting
        _awardXP(msg.sender, RETWEET_XP_REWARD, "Post Retweet");
        
        emit PostRetweeted(_postId, msg.sender);
    }
    
    /**
     * @dev Create a new quest (only owner)
     */
    function createQuest(
        string memory _title,
        string memory _description,
        uint256 _xpReward,
        uint256 _maxProgress,
        string memory _difficulty,
        string memory _questType,
        uint256 _timeLimit
    ) external onlyOwner {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_xpReward > 0, "XP reward must be positive");
        require(_maxProgress > 0, "Max progress must be positive");
        
        _questIds.increment();
        uint256 newQuestId = _questIds.current();
        
        quests[newQuestId] = Quest({
            id: newQuestId,
            title: _title,
            description: _description,
            xpReward: _xpReward,
            maxProgress: _maxProgress,
            difficulty: _difficulty,
            questType: _questType,
            timeLimit: _timeLimit,
            isActive: true
        });
        
        allQuests.push(newQuestId);
        
        emit QuestCreated(newQuestId, _title, _xpReward);
    }
    
    /**
     * @dev Start a quest
     */
    function startQuest(uint256 _questId) external {
        require(registeredUsers[msg.sender], "User not registered");
        require(quests[_questId].isActive, "Quest does not exist");
        require(userQuests[msg.sender][_questId].startedAt == 0, "Quest already started");
        
        userQuests[msg.sender][_questId] = UserQuest({
            questId: _questId,
            user: msg.sender,
            progress: 0,
            startedAt: block.timestamp,
            completed: false,
            claimed: false
        });
        
        userActiveQuests[msg.sender].push(_questId);
        
        emit QuestStarted(_questId, msg.sender);
    }
    
    /**
     * @dev Update quest progress (can be called by user or owner)
     */
    function updateQuestProgress(uint256 _questId, address _user, uint256 _progress) external {
        require(msg.sender == _user || msg.sender == owner(), "Not authorized");
        require(registeredUsers[_user], "User not registered");
        require(quests[_questId].isActive, "Quest does not exist");
        require(userQuests[_user][_questId].startedAt > 0, "Quest not started");
        require(!userQuests[_user][_questId].completed, "Quest already completed");
        
        userQuests[_user][_questId].progress = _progress;
        
        // Check if quest is completed
        if (_progress >= quests[_questId].maxProgress) {
            userQuests[_user][_questId].completed = true;
            emit QuestCompleted(_questId, _user, quests[_questId].xpReward);
        }
        
        emit QuestProgressUpdated(_questId, _user, _progress);
    }
    
    /**
     * @dev Claim quest reward
     */
    function claimQuestReward(uint256 _questId) external nonReentrant {
        require(registeredUsers[msg.sender], "User not registered");
        require(userQuests[msg.sender][_questId].completed, "Quest not completed");
        require(!userQuests[msg.sender][_questId].claimed, "Reward already claimed");
        
        userQuests[msg.sender][_questId].claimed = true;
        users[msg.sender].questsCompleted++;
        
        // Award XP
        _awardXP(msg.sender, quests[_questId].xpReward, "Quest Completion");
    }
    
    /**
     * @dev Award XP to user and check for level up
     */
    function _awardXP(address _user, uint256 _amount, string memory _reason) internal {
        users[_user].totalXP += _amount;
        
        uint256 newLevel = (users[_user].totalXP / XP_PER_LEVEL) + 1;
        if (newLevel > users[_user].level) {
            users[_user].level = newLevel;
            emit LevelUp(_user, newLevel);
        }
        
        emit XPEarned(_user, _amount, _reason);
    }
    
    // View functions
    function getUser(address _user) external view returns (User memory) {
        return users[_user];
    }
    
    function getPost(uint256 _postId) external view returns (Post memory) {
        return posts[_postId];
    }
    
    function getQuest(uint256 _questId) external view returns (Quest memory) {
        return quests[_questId];
    }
    
    function getUserQuest(address _user, uint256 _questId) external view returns (UserQuest memory) {
        return userQuests[_user][_questId];
    }
    
    function getUserPosts(address _user) external view returns (uint256[] memory) {
        return userPostIds[_user];
    }
    
    function getUserActiveQuests(address _user) external view returns (uint256[] memory) {
        return userActiveQuests[_user];
    }
    
    function getAllPosts() external view returns (uint256[] memory) {
        return allPosts;
    }
    
    function getAllQuests() external view returns (uint256[] memory) {
        return allQuests;
    }
    
    function getAllUsers() external view returns (address[] memory) {
        return allUsers;
    }
    
    function getTotalUsers() external view returns (uint256) {
        return allUsers.length;
    }
    
    function getTotalPosts() external view returns (uint256) {
        return allPosts.length;
    }
    
    function getTotalQuests() external view returns (uint256) {
        return allQuests.length;
    }
    
    function hasLikedPost(uint256 _postId, address _user) external view returns (bool) {
        return postLikes[_postId][_user];
    }
    
    function hasRetweetedPost(uint256 _postId, address _user) external view returns (bool) {
        return postRetweets[_postId][_user];
    }
    
    // Admin functions
    function deactivatePost(uint256 _postId) external onlyOwner {
        posts[_postId].isActive = false;
    }
    
    function deactivateQuest(uint256 _questId) external onlyOwner {
        quests[_questId].isActive = false;
    }
    
    function deactivateUser(address _user) external onlyOwner {
        users[_user].isActive = false;
    }
}