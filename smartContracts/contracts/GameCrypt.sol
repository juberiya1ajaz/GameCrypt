// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';

/// @title GameCrypt
/// @notice This contract handles the token management and Showdown logic for the GameCrypt game
/// @notice Version 1.0.0

contract GameCrypt is ERC1155, Ownable, ERC1155Supply {
  string public baseURI; // baseURI where token metadata is stored
  uint256 public totalSupply; // Total number of tokens minted
  uint256 public constant DEVIL = 0;
  uint256 public constant GRIFFIN = 1;
  uint256 public constant FIREBIRD = 2;
  uint256 public constant KAMO = 3;
  uint256 public constant KUKULKAN = 4;
  uint256 public constant CELESTION = 5;

  uint256 public constant MAX_ATTACK_DEFEND_STRENGTH = 10;

  enum ShowdownStatus{ PENDING, STARTED, ENDED }

  struct GameToken {
    string name;
    uint256 id;
    uint256 attackStrength;
    uint256 defenseStrength;
  }

  /// @dev Player struct to store player info
  struct Player {
    address playerAddress; /// @param playerAddress player wallet address
    string playerName; /// @param playerName player name; set by player during registration
    uint256 playerMana; /// @param playerMana player mana; affected by Showdown results
    uint256 playerHealth; /// @param playerHealth player health; affected by Showdown results
    bool inShowdown; /// @param inShowdown boolean to indicate if a player is in Showdown
  }

  /// @dev Showdown struct to store Showdown info
  struct Showdown {
    ShowdownStatus ShowdownStatus; /// @param ShowdownStatus enum to indicate Showdown status
    bytes32 ShowdownHash; /// @param ShowdownHash a hash of the Showdown name
    string name; /// @param name Showdown name; set by player who creates Showdown
    address[2] players; /// @param players address array representing players in this Showdown
    uint8[2] moves; /// @param moves uint array representing players' move
    address winner; /// @param winner winner address
  }

  mapping(address => uint256) public playerInfo; // Mapping of player addresses to player index in the players array
  mapping(address => uint256) public playerTokenInfo; // Mapping of player addresses to player token index in the gameTokens array
  mapping(string => uint256) public ShowdownInfo; // Mapping of Showdown name to Showdown index in the Showdowns array

  Player[] public players; // Array of players
  GameToken[] public gameTokens; // Array of game tokens
  Showdown[] public Showdowns; // Array of Showdowns

  function isPlayer(address addr) public view returns (bool) {
    if(playerInfo[addr] == 0) {
      return false;
    } else {
      return true;
    }
  }

  function getPlayer(address addr) public view returns (Player memory) {
    require(isPlayer(addr), "Player doesn't exist!");
    return players[playerInfo[addr]];
  }

  function getAllPlayers() public view returns (Player[] memory) {
    return players;
  }

  function isPlayerToken(address addr) public view returns (bool) {
    if(playerTokenInfo[addr] == 0) {
      return false;
    } else {
      return true;
    }
  }

  function getPlayerToken(address addr) public view returns (GameToken memory) {
    require(isPlayerToken(addr), "Game token doesn't exist!");
    return gameTokens[playerTokenInfo[addr]];
  }

  function getAllPlayerTokens() public view returns (GameToken[] memory) {
    return gameTokens;
  }

  // Showdown getter function
  function isShowdown(string memory _name) public view returns (bool) {
    if(ShowdownInfo[_name] == 0) {
      return false;
    } else {
      return true;
    }
  }

  function getShowdown(string memory _name) public view returns (Showdown memory) {
    require(isShowdown(_name), "Showdown doesn't exist!");
    return Showdowns[ShowdownInfo[_name]];
  }

  function getAllShowdowns() public view returns (Showdown[] memory) {
    return Showdowns;
  }

  function updateShowdown(string memory _name, Showdown memory _newShowdown) private {
    require(isShowdown(_name), "Showdown doesn't exist");
    Showdowns[ShowdownInfo[_name]] = _newShowdown;
  }

  // Events
  event NewPlayer(address indexed owner, string name);
  event NewShowdown(string ShowdownName, address indexed player1, address indexed player2);
  event ShowdownEnded(string ShowdownName, address indexed winner, address indexed loser);
  event ShowdownMove(string indexed ShowdownName, bool indexed isFirstMove);
  event NewGameToken(address indexed owner, uint256 id, uint256 attackStrength, uint256 defenseStrength);
  event RoundEnded(address[2] damagedPlayers);

  /// @dev Initializes the contract by setting a `metadataURI` to the token collection
  /// @param _metadataURI baseURI where token metadata is stored
  constructor(string memory _metadataURI) ERC1155(_metadataURI) {
    baseURI = _metadataURI; // Set baseURI
    initialize();
  }

  function setURI(string memory newuri) public onlyOwner {
    _setURI(newuri);
  }

  function initialize() private {
    gameTokens.push(GameToken("", 0, 0, 0));
    players.push(Player(address(0), "", 0, 0, false));
    Showdowns.push(Showdown(ShowdownStatus.PENDING, bytes32(0), "", [address(0), address(0)], [0, 0], address(0)));
  }

  /// @dev Registers a player
  /// @param _name player name; set by player
  function registerPlayer(string memory _name, string memory _gameTokenName) external {
    require(!isPlayer(msg.sender), "Player already registered"); // Require that player is not already registered
    
    uint256 _id = players.length;
    players.push(Player(msg.sender, _name, 10, 25, false)); // Adds player to players array
    playerInfo[msg.sender] = _id; // Creates player info mapping

    createRandomGameToken(_gameTokenName);
    
    emit NewPlayer(msg.sender, _name); // Emits NewPlayer event
  }

  /// @dev internal function to generate random number; used for Showdown Card Attack and Defense Strength
  function _createRandomNum(uint256 _max, address _sender) internal view returns (uint256 randomValue) {
    uint256 randomNum = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, _sender)));

    randomValue = randomNum % _max;
    if(randomValue == 0) {
      randomValue = _max / 2;
    }

    return randomValue;
  }

  /// @dev internal function to create a new Showdown Card
  function _createGameToken(string memory _name) internal returns (GameToken memory) {
    uint256 randAttackStrength = _createRandomNum(MAX_ATTACK_DEFEND_STRENGTH, msg.sender);
    uint256 randDefenseStrength = MAX_ATTACK_DEFEND_STRENGTH - randAttackStrength;
    
    uint8 randId = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 100);
    randId = randId % 6;
    if (randId == 0) {
      randId++;
    }
    
    GameToken memory newGameToken = GameToken(
      _name,
      randId,
      randAttackStrength,
      randDefenseStrength
    );

    uint256 _id = gameTokens.length;
    gameTokens.push(newGameToken);
    playerTokenInfo[msg.sender] = _id;

    _mint(msg.sender, randId, 1, '0x0');
    totalSupply++;
    
    emit NewGameToken(msg.sender, randId, randAttackStrength, randDefenseStrength);
    return newGameToken;
  }

  /// @dev Creates a new game token
  /// @param _name game token name; set by player
  function createRandomGameToken(string memory _name) public {
    require(!getPlayer(msg.sender).inShowdown, "Player is in a Showdown"); // Require that player is not already in a Showdown
    require(isPlayer(msg.sender), "Please Register Player First"); // Require that the player is registered
    
    _createGameToken(_name); // Creates game token
  }

  function getTotalSupply() external view returns (uint256) {
    return totalSupply;
  }

  /// @dev Creates a new Showdown
  /// @param _name Showdown name; set by player
  function createShowdown(string memory _name) external returns (Showdown memory) {
    require(isPlayer(msg.sender), "Please Register Player First"); // Require that the player is registered
    require(!isShowdown(_name), "Showdown already exists!"); // Require Showdown with same name should not exist

    bytes32 ShowdownHash = keccak256(abi.encode(_name));
    
    Showdown memory _Showdown = Showdown(
      ShowdownStatus.PENDING, // Showdown pending
      ShowdownHash, // Showdown hash
      _name, // Showdown name
      [msg.sender, address(0)], // player addresses; player 2 empty until they joins Showdown
      [0, 0], // moves for each player
      address(0) // winner address; empty until Showdown ends
    );

    uint256 _id = Showdowns.length;
    ShowdownInfo[_name] = _id;
    Showdowns.push(_Showdown);
    
    return _Showdown;
  }

  /// @dev Player joins Showdown
  /// @param _name Showdown name; name of Showdown player wants to join
  function joinShowdown(string memory _name) external returns (Showdown memory) {
    Showdown memory _Showdown = getShowdown(_name);

    require(_Showdown.ShowdownStatus == ShowdownStatus.PENDING, "Showdown already started!"); // Require that Showdown has not started
    require(_Showdown.players[0] != msg.sender, "Only player two can join a Showdown"); // Require that player 2 is joining the Showdown
    require(!getPlayer(msg.sender).inShowdown, "Already in Showdown"); // Require that player is not already in a Showdown
    
    _Showdown.ShowdownStatus = ShowdownStatus.STARTED;
    _Showdown.players[1] = msg.sender;
    updateShowdown(_name, _Showdown);

    players[playerInfo[_Showdown.players[0]]].inShowdown = true;
    players[playerInfo[_Showdown.players[1]]].inShowdown = true;

    emit NewShowdown(_Showdown.name, _Showdown.players[0], msg.sender); // Emits NewShowdown event
    return _Showdown;
  }

  // Read Showdown move info for player 1 and player 2
  function getShowdownMoves(string memory _ShowdownName) public view returns (uint256 P1Move, uint256 P2Move) {
    Showdown memory _Showdown = getShowdown(_ShowdownName);

    P1Move = _Showdown.moves[0];
    P2Move = _Showdown.moves[1];

    return (P1Move, P2Move);
  }

  function _registerPlayerMove(uint256 _player, uint8 _choice, string memory _ShowdownName) internal {
    require(_choice == 1 || _choice == 2, "Choice should be either 1 or 2!");
    require(_choice == 1 ? getPlayer(msg.sender).playerMana >= 3 : true, "Mana not sufficient for attacking!");
    Showdowns[ShowdownInfo[_ShowdownName]].moves[_player] = _choice;
  }

  // User chooses attack or defense move for Showdown card
  function attackOrDefendChoice(uint8 _choice, string memory _ShowdownName) external {
    Showdown memory _Showdown = getShowdown(_ShowdownName);

    require(
        _Showdown.ShowdownStatus == ShowdownStatus.STARTED,
        "Showdown not started. Please tell another player to join the Showdown"
    ); // Require that Showdown has started
    require(
        _Showdown.ShowdownStatus != ShowdownStatus.ENDED,
        "Showdown has already ended"
    ); // Require that Showdown has not ended
    require(
      msg.sender == _Showdown.players[0] || msg.sender == _Showdown.players[1],
      "You are not in this Showdown"
    ); // Require that player is in the Showdown

    require(_Showdown.moves[_Showdown.players[0] == msg.sender ? 0 : 1] == 0, "You have already made a move!");

    _registerPlayerMove(_Showdown.players[0] == msg.sender ? 0 : 1, _choice, _ShowdownName);

    _Showdown = getShowdown(_ShowdownName);
    uint _movesLeft = 2 - (_Showdown.moves[0] == 0 ? 0 : 1) - (_Showdown.moves[1] == 0 ? 0 : 1);
    emit ShowdownMove(_ShowdownName, _movesLeft == 1 ? true : false);
    
    if(_movesLeft == 0) {
      _awaitShowdownResults(_ShowdownName);
    }
  }

  // Awaits Showdown results
  function _awaitShowdownResults(string memory _ShowdownName) internal {
    Showdown memory _Showdown = getShowdown(_ShowdownName);

    require(
      msg.sender == _Showdown.players[0] || msg.sender == _Showdown.players[1],
      "Only players in this Showdown can make a move"
    );

    require(
      _Showdown.moves[0] != 0 &&  _Showdown.moves[1] != 0,
      "Players still need to make a move"
    );

    _resolveShowdown(_Showdown);
  }

  struct P {
    uint index;
    uint move;
    uint health;
    uint attack;
    uint defense;
  }

  /// @dev Resolve Showdown function to determine winner and loser of Showdown
  /// @param _Showdown Showdown; Showdown to resolve
  function _resolveShowdown(Showdown memory _Showdown) internal {
    P memory p1 = P(
        playerInfo[_Showdown.players[0]],
        _Showdown.moves[0],
        getPlayer(_Showdown.players[0]).playerHealth,
        getPlayerToken(_Showdown.players[0]).attackStrength,
        getPlayerToken(_Showdown.players[0]).defenseStrength
    );

    P memory p2 = P(
        playerInfo[_Showdown.players[1]],
        _Showdown.moves[1],
        getPlayer(_Showdown.players[1]).playerHealth,
        getPlayerToken(_Showdown.players[1]).attackStrength,
        getPlayerToken(_Showdown.players[1]).defenseStrength
    );

    address[2] memory _damagedPlayers = [address(0), address(0)];
    
    if (p1.move == 1 && p2.move == 1) {
      if (p1.attack >= p2.health) {
        _endShowdown(_Showdown.players[0], _Showdown);
      } else if (p2.attack >= p1.health) {
        _endShowdown(_Showdown.players[1], _Showdown);
      } else {
        players[p1.index].playerHealth -= p2.attack;
        players[p2.index].playerHealth -= p1.attack;

        players[p1.index].playerMana -= 3;
        players[p2.index].playerMana -= 3;

        // Both player's health damaged
        _damagedPlayers = _Showdown.players;
      }
    } else if (p1.move == 1 && p2.move == 2) {
      uint256 PHAD = p2.health + p2.defense;
      if (p1.attack >= PHAD) {
        _endShowdown(_Showdown.players[0], _Showdown);
      } else {
        uint256 healthAfterAttack;
        
        if(p2.defense > p1.attack) {
          healthAfterAttack = p2.health;
        } else {
          healthAfterAttack = PHAD - p1.attack;

          // Player 2 health damaged
          _damagedPlayers[0] = _Showdown.players[1];
        }

        players[p2.index].playerHealth = healthAfterAttack;

        players[p1.index].playerMana -= 3;
        players[p2.index].playerMana += 3;
      }
    } else if (p1.move == 2 && p2.move == 1) {
      uint256 PHAD = p1.health + p1.defense;
      if (p2.attack >= PHAD) {
        _endShowdown(_Showdown.players[1], _Showdown);
      } else {
        uint256 healthAfterAttack;
        
        if(p1.defense > p2.attack) {
          healthAfterAttack = p1.health;
        } else {
          healthAfterAttack = PHAD - p2.attack;

          // Player 1 health damaged
          _damagedPlayers[0] = _Showdown.players[0];
        }

        players[p1.index].playerHealth = healthAfterAttack;

        players[p1.index].playerMana += 3;
        players[p2.index].playerMana -= 3;
      }
    } else if (p1.move == 2 && p2.move == 2) {
        players[p1.index].playerMana += 3;
        players[p2.index].playerMana += 3;
    }

    emit RoundEnded(
      _damagedPlayers
    );

    // Reset moves to 0
    _Showdown.moves[0] = 0;
    _Showdown.moves[1] = 0;
    updateShowdown(_Showdown.name, _Showdown);

    // Reset random attack and defense strength
    uint256 _randomAttackStrengthPlayer1 = _createRandomNum(MAX_ATTACK_DEFEND_STRENGTH, _Showdown.players[0]);
    gameTokens[playerTokenInfo[_Showdown.players[0]]].attackStrength = _randomAttackStrengthPlayer1;
    gameTokens[playerTokenInfo[_Showdown.players[0]]].defenseStrength = MAX_ATTACK_DEFEND_STRENGTH - _randomAttackStrengthPlayer1;

    uint256 _randomAttackStrengthPlayer2 = _createRandomNum(MAX_ATTACK_DEFEND_STRENGTH, _Showdown.players[1]);
    gameTokens[playerTokenInfo[_Showdown.players[1]]].attackStrength = _randomAttackStrengthPlayer2;
    gameTokens[playerTokenInfo[_Showdown.players[1]]].defenseStrength = MAX_ATTACK_DEFEND_STRENGTH - _randomAttackStrengthPlayer2;   
  }

  function quitShowdown(string memory _ShowdownName) public {
    Showdown memory _Showdown = getShowdown(_ShowdownName);
    require(_Showdown.players[0] == msg.sender || _Showdown.players[1] == msg.sender, "You are not in this Showdown!");

    _Showdown.players[0] == msg.sender ? _endShowdown(_Showdown.players[1], _Showdown) : _endShowdown(_Showdown.players[0], _Showdown);
  }

  /// @dev internal function to end the Showdown
  /// @param ShowdownEnder winner address
  /// @param _Showdown Showdown; taken from attackOrDefend function
  function _endShowdown(address ShowdownEnder, Showdown memory _Showdown) internal returns (Showdown memory) {
    require(_Showdown.ShowdownStatus != ShowdownStatus.ENDED, "Showdown already ended"); // Require that Showdown has not ended

    _Showdown.ShowdownStatus = ShowdownStatus.ENDED;
    _Showdown.winner = ShowdownEnder;
    updateShowdown(_Showdown.name, _Showdown);

    uint p1 = playerInfo[_Showdown.players[0]];
    uint p2 = playerInfo[_Showdown.players[1]];

    players[p1].inShowdown = false;
    players[p1].playerHealth = 25;
    players[p1].playerMana = 10;

    players[p2].inShowdown = false;
    players[p2].playerHealth = 25;
    players[p2].playerMana = 10;

    address _ShowdownLoser = ShowdownEnder == _Showdown.players[0] ? _Showdown.players[1] : _Showdown.players[0];

    emit ShowdownEnded(_Showdown.name, ShowdownEnder, _ShowdownLoser); // Emits ShowdownEnded event

    return _Showdown;
  }

  // Turns uint256 into string
  function uintToStr(uint256 _i) internal pure returns (string memory _uintAsString) {
    if (_i == 0) {
      return '0';
    }
    uint256 j = _i;
    uint256 len;
    while (j != 0) {
      len++;
      j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint256 k = len;
    while (_i != 0) {
      k = k - 1;
      uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
      bytes1 b1 = bytes1(temp);
      bstr[k] = b1;
      _i /= 10;
    }
    return string(bstr);
  }

  // Token URI getter function
  function tokenURI(uint256 tokenId) public view returns (string memory) {
    return string(abi.encodePacked(baseURI, '/', uintToStr(tokenId), '.json'));
  }

  // The following functions are overrides required by Solidity.
  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal override(ERC1155, ERC1155Supply) {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}



// Implementing Azure Blockchain Service

contract AzureBlockchainStorage {
    uint storedData;

    constructor() public {
        storedData = 7;
    }

    function get() public view returns (uint) {
        return storedData;
    }

    function set(uint value) public {
        storedData = value;
    }
}