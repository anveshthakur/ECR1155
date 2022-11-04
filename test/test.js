const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

let Nfthing;
let owner, addr1, addrs;
let baseuri, name, symbol;
let MINT_COST = [2000000000000000, 1000000000000000];

const OWNABLE_ERR_STR = 'Ownable: caller is not the owner';
const MAX_AMOUNT_STR = 'Already reached maximum amount for this item';
const PAUSED_STR = 'The Contract is paused!';

beforeEach(async function (){
    name               = "Nfthing";
    symbol             = "NFTH";
    baseuri            = "https://";
    provider           = ethers.provider;
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    let nft = await hre.ethers.getContractFactory("Nfthing");

    Nfthing = await nft.deploy(
        name, 
        symbol, 
        baseuri, 
    );

    await Nfthing.deployed();
});

describe("Deployment Test", async () => {
    it("Owner should be the deployer", async () => {
        expect(await Nfthing.owner()).to.equal(owner.address);
    });

    it("Should have the valid URI", async() => {
        expect(await Nfthing.uriPrefix()).to.equal(baseuri);
    });
});

describe("Setters", async () => {
    it("should set max per user", async () => {
        expect(await Nfthing.maxPerUser(0)).to.equal(1);
        await Nfthing.setMaxPerUser(0, 2)
        expect(await Nfthing.maxPerUser(0)).to.equal(2);
    });

    it("should set max per user by owner only", async () => {
        await expect(Nfthing
            .connect(addr1)
            .setMaxPerUser(0, 2)).to.be.revertedWith(OWNABLE_ERR_STR);
    });
    
    it("should set total supply for an item", async () => {
        expect(await Nfthing.supply(0)).to.equal(20);
        await Nfthing.setSupply(0, 100);
        expect(await Nfthing.supply(0)).to.equal(100);
    });
    
    it("should set total supply for an item by owner only", async () => {
        await expect(Nfthing
            .connect(addr1).setSupply(0, 200))
            .to.be.revertedWith(OWNABLE_ERR_STR);
    });

    it("should set the mint price", async () => {
        expect(await Nfthing.mintPrice(0)).to.equal(BigNumber.from(2000000000000000));
        await Nfthing.setMintPrice(0, BigNumber.from(1000000000000000));
        expect(await Nfthing.mintPrice(0)).to.equal(BigNumber.from(1000000000000000));
    });
    
    it("should set the mint price by owner only", async () => {
        await expect(Nfthing
        .connect(addr1)
        .setMintPrice(0, BigNumber.from(1000000000000000)))
        .to.be.revertedWith(OWNABLE_ERR_STR);
    });
    
    it("should set the uri-prefix", async () => {
        expect(await Nfthing.setUriPrefix(baseuri + "1"))
        expect(await Nfthing.uriPrefix())
        .to.be.equal(baseuri + "1");
    });
    
    it("should set the uri-suffix by owner only", async () => {
        await expect(Nfthing
            .connect(addr1)
            .setUriPrefix(baseuri + "1"))
            .to.be.revertedWith(OWNABLE_ERR_STR);
    });
})

describe("Minting functionality", async () => {
    it("Should mint 1 nft of type 1 and 2", async() => {
        let amount = 1;
        await Nfthing.mint(amount, 0, {value: BigNumber.from(MINT_COST[0] * amount)});
        expect(await Nfthing.balanceOf(owner.address, 0)).to.equal(1);
        
        await Nfthing.mint(amount, 1, {value: BigNumber.from(MINT_COST[1] * amount)});
        expect(await Nfthing.balanceOf(owner.address, 1)).to.equal(1);
    })

    it("Should not mint the 1 type", async () => {
        let amount = 2;
        await expect(Nfthing
            .mint(amount, 0, {value: BigNumber.from(MINT_COST[0] * amount)}))
            .to.be.revertedWith(MAX_AMOUNT_STR);
    })

    it("Should mint 2 nft of type 2", async() => {
        let amount = 2;
        await Nfthing.mint(amount, 1, {value: BigNumber.from(MINT_COST[1] * amount)});
        expect(await Nfthing.balanceOf(owner.address, 1)).to.equal(2);
    })

    it("Should mint 3 nft of 2", async() => {
        let amount = 3;        
        await Nfthing.mint(amount, 1, {value: BigNumber.from(MINT_COST[1] * amount)});
        expect(await Nfthing.balanceOf(owner.address, 1)).to.equal(3);
    })

    it("Should mint 4 nft of 2", async() => {
        let amount = 4;        
        await Nfthing.mint(amount, 1, {value: BigNumber.from(MINT_COST[1] * amount)});
        expect(await Nfthing.balanceOf(owner.address, 1)).to.equal(4);
    })

    it("Should mint 5 nft of 2", async() => {
        let amount = 5;        
        await Nfthing.mint(amount, 1, {value: BigNumber.from(MINT_COST[1] * amount)});
        expect(await Nfthing.balanceOf(owner.address, 1)).to.equal(5);
    })

    it("Should not mint more than 5 ", async() => {
        let amount = 6;        
        await expect(Nfthing.mint(amount, 1, {value: BigNumber.from(MINT_COST[1] * amount)}))
        .to.be
        .revertedWith(MAX_AMOUNT_STR);
    })

    it("Should not mint if the contract is paused", async() => {
        let amount = 1;
        await Nfthing.setPaused(true);
        await expect(Nfthing.mint(amount, 1, {value: BigNumber.from(MINT_COST[1] * amount)}))
        .to.be
        .revertedWith(PAUSED_STR);
    })

    it("Should not mint if the ether supplied is less", async() => {
        let amount = 2;
        await expect(Nfthing.mint(amount, 1, {value: BigNumber.from(MINT_COST[1] * 1)}))
        .to.be
        .revertedWith('Mint amount not appropriate');
    })
})