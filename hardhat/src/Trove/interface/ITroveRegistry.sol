// SPDX-License-Identifier: AGPL-1.0
pragma solidity 0.8.7;

interface ITroveRegistry {
    
    enum EntityType{ TREASURE, SHOWCASE, CUSTOM }

    function addEntity(uint256 layerId, string calldata name, EntityType entityType, string calldata ipfs) external ;

}