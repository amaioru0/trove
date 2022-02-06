pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LayersRegistry is Ownable {

    constructor () {

    }

    using Counters for Counters.Counter;
    Counters.Counter private _layersIdCounter;

    struct Entity {
        string name;
        string entityType;
        string ipfs;
        bool status;
        string geohash;
    }
    

    struct Layer {
        string name;
        uint256 layerId;
        address owner;
    }

    // Mapping holding all layers
    mapping(uint256 => Layer) public layers;

    // Mapping holding all entities
    mapping(uint256 => mapping(uint256 => Entity)) public entities;


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
    
}