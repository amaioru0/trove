pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Trove is Ownable {
        
    constructor () {
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
  
    mapping (uint256 => Entity) entitys;

  struct Layer {
        string name;
        uint256 layerId;
        address owner;
    }

    struct Entity {
        string entity;
        uint256 tokenId;
        string tokenUri;
        string entityType;
        bool status;
        string geohash;
    }
    
    event NewEntity(string network, string entity, uint256 tokenId, string tokenUri, string entityType, bool status, string geohash);


    function addEntity(string memory entity, uint256 tokenId, string memory tokenUri, string memory entityType, bool status, string memory geohash) public onlyOwner returns (bool) {
       uint256 entityId = _tokenIdCounter.current();
       entitys[entityId] = Entity({
        entity: entity,
        tokenId: tokenId,
        tokenUri: tokenUri,
        entityType: entityType,
        status: status,
        geohash: geohash
        });
        emit NewEntity(network, entity, tokenId, tokenUri, entityType, status, geohash);
        _tokenIdCounter.increment();
        return true;
    }

} 
