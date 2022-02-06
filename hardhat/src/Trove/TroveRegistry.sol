// SPDX-License-Identifier: AGPL-1.0
pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @custom:security-contact alex@homebox.ie


contract TroveRegistry is Ownable {

    address hideServ;
    address vault;

    constructor (address _hideServ) {
        hideServ = _hideServ;
    }


    using Counters for Counters.Counter;
    Counters.Counter private _layersIdCounter;

    // Allowed entity types
    enum EntityType{ TREASURE, SHOWCASE, CUSTOM }

    // Allowed treasure types
    enum TreasureType{ VAULT, MINTABLE }

    // Entity struct
    struct Entity {
        // for all entities
        string name;
        EntityType entityType;
        bool status;
        string geohash;
        // for treasure entities
        TreasureType treasureType;
        // for TreasureType VAULT
        uint256 vaultId;
        // for TreasureType MINTABLE 
    }
    
    // Layer struct
    struct Layer {
        string name;
        uint256 layerId;
        address owner;
        address prover;
    }

    // Mapping holding all layers
    mapping(uint256 => Layer) public layers;

    // Mapping holding all entities for a specified layer
    mapping(uint256 => mapping(uint256 => Entity)) public entities;

    // Mapping holding entities ids for each layer
    mapping(uint256 => Counters.Counter) public entitiesCounter;

    // Event emited when a new layer is created
    event NewLayer(string name, uint256 layerId, address owner);

    // Event emited when a new entity is added to a layer
    event EntityAdded(uint256 layerId, uint256 entityId, string name, EntityType entityType, TreasureType treasureType);

    // Event emited when geohash was fullfilled on entity
    event EntityReady(uint256 layerId, uint256 entityId, string name, EntityType entityType, TreasureType treasureType, string geohash, bool status, uint256 vaultId);

    // Function to create a new layer
    function createLayer(string calldata name, address owner, address prover) public {
        uint256 layerId = _layersIdCounter.current();
        Layer storage l = layers[layerId];
        l.name = name;
        l.layerId = layerId;
        l.owner = owner;
        l.prover = prover;

        emit NewLayer(name, layerId, owner);
        _layersIdCounter.increment();
    }


    // Function to add a new entity to a layer by layer owner
    function addEntity(uint256 layerId, string calldata name, EntityType entityType, TreasureType treasureType, uint256 vaultId) public {
        // require(msg.sender == layers[layerId].owner), "Only layer owner can add entity");
        uint256 entityId = entitiesCounter[layerId].current();
        entities[layerId][entityId] = Entity({
            name: name,
            entityType: entityType,
            status: false,
            geohash: "",
            treasureType: treasureType,
            vaultId: vaultId
        });
        entitiesCounter[layerId].increment();
        emit EntityAdded(layerId, entityId, name, entityType, treasureType);
    }

    // hideServ update geohash function
    function fullfillGeohash(uint256 layerId, uint256 entityId, string calldata geohash) public {
        require(msg.sender == hideServ, "Omly hideServ can fullfill geohash");
        entities[layerId][entityId].geohash = geohash;
        entities[layerId][entityId].status = true;
        // event EntityReady(uint256 layerId, uint256 entityId, string name, EntityType entityType, TreasureType treasureType, string geohash, bool status, uint256 vaultId);
        emit EntityReady(layerId, entityId, entities[layerId][entityId].name, entities[layerId][entityId].entityType, entities[layerId][entityId].treasureType, entities[layerId][entityId].geohash, entities[layerId][entityId].status, entities[layerId][entityId].vaultId);
    }


}