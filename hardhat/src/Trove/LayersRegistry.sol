pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LayersRegistry is Ownable {

    constructor () {

    }

    using Counters for Counters.Counter;
    Counters.Counter private _layersIdCounter;

    // Allowed entity types
    enum EntityType{ TREASURE, SHOWCASE, CUSTOM }

    // Entity struct
    struct Entity {
        string name;
        EntityType entityType;
        string ipfs;
        bool status;
        string geohash;
    }
    
    // Layer struct
    struct Layer {
        string name;
        uint256 layerId;
        address owner;
    }

    // Mapping holding all layers
    mapping(uint256 => Layer) public layers;

    // Mapping holding all entities for a specified layer
    mapping(uint256 => mapping(uint256 => Entity)) public entities;

    // Mapping holding entities ids for each layer
    mapping(uint256 => Counters.Counter) public entitiesCounter;

    // Event emited when a new layer is created
    event NewLayer(string name, uint256 layerId, address owner);


    // Function to create a new layer
    function createLayer(string calldata name, address owner) public {
        uint256 layerId = _layersIdCounter.current();
        Layer storage l = layers[layerId];
        l.name = name;
        l.layerId = layerId;
        l.owner = owner;

        emit NewLayer(name, layerId, owner);
        _layersIdCounter.increment();
    }


    // Function to add a new entity to a layer

    function addEntity(uint256 layerId, string calldata name, EntityType entityType, string calldata ipfs, bool status, string calldata geohash) public {
        require(msg.sender == layers[layerId].owner, "Only layer owner can add entity");
        uint256 entityId = entitiesCounter[layerId].current();
        entities[layerId][entityId] = Entity({
            name: name,
            entityType: entityType,
            ipfs: ipfs,
            status: status,
            geohash: geohash
        });
        entitiesCounter[layerId].increment();
    }


    
}