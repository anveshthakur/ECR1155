const fs = require("fs");

const saveFrontendFiles = (contract) => {
    const configDir = __dirname + "/../config";
    let array = [];
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
    }
    console.log("Creating cfg file in frontend...")
    array.push({'contractOneFive' :contract.address});
    var json = JSON.stringify(array); //convert it back to json
    fs.writeFileSync(configDir + '/cfg.json', json, 'utf8', () => {});
    console.log("Success!")    
}

async function main(){

    const IPFS_LINK = "ipfs://bafybeib4tnidedb44fm67gtzcyovsus5uwr3m3inj5eqbxrgkpw7zo5rii/{id}.json"


    const networkName = hre.network.name;
    
    const chainId = hre.network.config.chainId;
    
    console.log("networkName:", networkName);
    console.log("chainID:", chainId);
    
    //get the account to deploy the contract
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    const NfthingOneFive = await hre.ethers.getContractFactory("NfthingOneFive");

    const nftOneFive = await NfthingOneFive.deploy(IPFS_LINK);

    await nftOneFive.deployed();

    console.log("NfthingOneFive deployed at: ", nftOneFive.address);

    !networkName === "hardhat" && saveFrontendFiles(nftOneFive);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });