import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
// import {parseEther} from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('TroveRegistry', {
    from: deployer,
    args: ["0x1406FFFCA4a936907Fe82F2180D2c7484b9609B3"],
    log: true,
  });
};
export default func;
func.tags = ['TroveRegistry'];
