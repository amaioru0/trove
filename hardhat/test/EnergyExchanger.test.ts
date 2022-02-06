import {assert, expect, should} from './chai-setup';
import {ethers, deployments, getUnnamedAccounts, getNamedAccounts, network} from 'hardhat';
import {EnergyExchanger, EgyLove, EnergyToken } from '../typechain';
import {setupUsers, delay} from './utils';


const setup = deployments.createFixture(async () => {
  await deployments.fixture('EnergyExchanger');
  await deployments.fixture('EgyLove');
  await deployments.fixture('EnergyToken');

  await delay(5000);
 
  const contracts = {
    EnergyExchanger: <EnergyExchanger>(
      await ethers.getContract('EnergyExchanger')
    ),
    EgyLove: <EgyLove>(
      await ethers.getContract('EgyLove')
    ),
    // EnergyToken: <EnergyToken>(
    //   await ethers.getContract('EnergyToken')
    // ),
  }

  const { deployer } = await getNamedAccounts();
  const users = await setupUsers([deployer], contracts);

  await users[0].EnergyExchanger.setEgyLove(users[0].EgyLove.address);
  // await users[0].EnergyExchanger.setEnergyToken(users[0].EnergyToken.address);

  await users[0].EgyLove.setEnergyExchanger(users[0].EnergyExchanger.address);
  // await users[0].EnergyToken.setEnergyExchanger(users[0].EnergyExchanger.address);

  return {
    ...contracts,
    users,
    deployer
  };
});


describe('EnergyExchanger', function () {
  it('Burns NFTs and awards token', async function () {
    const { users, EnergyExchanger, deployer } = await setup();
    
    const egyLoveAddressX = await users[0].EnergyExchanger.getEgyLove();
    const energyTokenAddressX = await users[0].EnergyExchanger.getEnergyToken();
    console.log(egyLoveAddressX);
    // await users[0].EnergyExchanger.exchange(1);

    await expect(users[0].EnergyExchanger.getEgyLove())
    .to.be.equal(users[0].EgyLove.address)
    // await expect(users[0].EnergyExchanger.setMessage(testMessage))
    //   .to.emit(EnergyExchanger, 'MessageChanged')
    //   .withArgs(users[0].address, testMessage);

  });
});
