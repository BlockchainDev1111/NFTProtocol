import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TokenERC20, TokenERC721 } from "../typechain-types";

describe("Protocol", () => {
  const initialPrice = BigNumber.from("10000");
  let userA: SignerWithAddress;
  let userB: SignerWithAddress;
  let beneficiary: SignerWithAddress;
  let ERC721: TokenERC721;
  let ERC20: TokenERC20;
  beforeEach(async () => {
    [userA, userB, beneficiary] = await ethers.getSigners();

    const ERC20Factory = await ethers.getContractFactory("TokenERC20");
    ERC20 = await ERC20Factory.connect(beneficiary).deploy("Token", "TKN");

    await ERC20.connect(beneficiary).mint(
      userA.address,
      BigNumber.from("1000000000")
    );

    const ERC721Factory = await ethers.getContractFactory("TokenERC721");
    ERC721 = await ERC721Factory.connect(beneficiary).deploy(
      beneficiary.address,
      ERC20.address,
      initialPrice,
      "ERC721",
      "NFT"
    );
  });

  it("Should have proper initial values", async () => {
    const owner = await ERC721.owner();
    const token = await ERC721.token();
    const price = await ERC721.price();
    const name = await ERC721.name();
    const symbol = await ERC721.symbol();

    expect(owner).to.be.eql(beneficiary.address);
    expect(price).to.be.eql(initialPrice);
    expect(token).to.be.eql(ERC20.address);
    expect(name).to.be.eql("ERC721");
    expect(symbol).to.be.eql("NFT");
  });
  it("Should allow to buy nft", async () => {
    const amount = BigNumber.from("1");
    const tokenId = BigNumber.from("0");
    const balanceOfUserBefore = await ERC20.balanceOf(userA.address);
    await ERC20.connect(userA).approve(ERC721.address, balanceOfUserBefore);

    await ERC721.connect(userA).buyNFTs(amount);

    const balanceOfUserAfter = await ERC20.balanceOf(userA.address);

    expect(balanceOfUserAfter).to.be.eql(
      balanceOfUserBefore.sub(amount.mul(initialPrice))
    );

    const ownerOfNft = await ERC721.ownerOf(tokenId);

    expect(ownerOfNft).to.be.eql(userA.address);
  });
});
