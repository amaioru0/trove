// SPDX-License-Identifier: AGPL-1.0
/// @custom:security-contact alex@homebox.ie
pragma solidity 0.8.7;

interface ITroveRegistry {
    
    enum EntityType{ TREASURE, SHOWCASE, CUSTOM }
    enum TreasureType{ VAULT, MINTABLE }

    function addEntity(uint256 layerId, string calldata name, EntityType entityType, TreasureType treasureType, uint256 vaultId) external ;

}