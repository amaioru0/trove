import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
// import {parseEther} from 'ethers/lib/utils';
import { promises as fs } from 'fs';
import path from 'path';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  const network = hre.network.name == "hardhat" ? "localhost" : 'mumbai';

  const basePath = path.join(__dirname, '../', 'deployments', network)
  const registryFile = await fs.readFile(`${basePath}/TroveRegistry.json`, 'utf8');
  const registryAddress = JSON.parse(registryFile).address

  await deploy('TroveVault', {
    from: deployer,
    args: [registryAddress],
    log: true,
  });
};
export default func;
func.tags = ['TroveVault'];
