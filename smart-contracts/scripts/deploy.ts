import { network } from "hardhat";

// async function verify(contractAddress: string, constructorArgs: any) {
//   console.log(`Verifying contract at ${contractAddress}...`);
//   try {
//     await hre.run("verify:verify", {
//       address: contractAddress,
//       constructorArguments: constructorArgs,
//     });
//   } catch (e: any) {
//     if (e?.message?.toLowerCase().includes("already verified")) {
//       console.log("Already verified!");
//     } else {
//       console.error(e);
//     }
//   }
// }

async function main() {
  const { ethers } = await network.connect({
    network: "testnet",
  });

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with:", deployer.address);

  // Deploy USDT
  const USDT = await ethers.getContractFactory("USDT");
  const usdt = await USDT.deploy();
  console.log("USDT deployed at:", await usdt.getAddress());

  // Deploy NGN
  const NGN = await ethers.getContractFactory("NGN");
  const ngn = await NGN.deploy();
  console.log("USDT deployed at:", await ngn.getAddress());

  // Faucet USDT
  await usdt.faucet(deployer.address, ethers.parseUnits("1000", 6));

  // Faucet USDT
  await ngn.faucet(deployer.address, ethers.parseUnits("1000", 2));

  // Deploy Oracle
  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy();
  console.log("Oracle deployed at:", await oracle.getAddress());

  // Set credit to asset rates
  await oracle.setCreditToAsset(usdt.getAddress(), ethers.parseEther("0.98"));
  await oracle.setCreditToAsset(ethers.ZeroAddress, ethers.parseEther("0.52"));

  // Deploy BorrowCredit
  const BorrowCredit = await ethers.getContractFactory("BorrowCredit");
  const borrowCredit = await BorrowCredit.deploy(await oracle.getAddress());
  console.log("BorrowCredit deployed at:", borrowCredit.getAddress());

  // Partner data
  const partners: Array<{
    address: string;
    credits: bigint;
    meta: {
      name: string;
      logo: string;
      description: string;
      website: string;
      location: string;
      sector: string;
      email: string;
      mobile: string;
    };
  }> = [
    {
      address: "0x081E56Ea7935e04Cc8B250D49486162c232091be",
      credits: ethers.parseEther("1000000"),
      meta: {
        name: "EduFund Africa",
        logo: "/partners/edufund-africa.png",
        description: "Supporting education across Africa through microfinance",
        website: "https://edufund-africa.org",
        location: "Kenya",
        sector: "Education Cooperative",
        email: "contact@edufund.africa",
        mobile: "+254 700 123 456",
      },
    },
    {
      address: "0x3E646e062F05e01e1860eA53a6DC81e7E9162DE6",
      credits: ethers.parseEther("750000"),
      meta: {
        name: "Green Harvest Co-op",
        logo: "/partners/green-harvest-coop.png",
        description: "Agricultural financing for sustainable farming",
        website: "https://greenharvest-coop.org",
        location: "Singapore",
        sector: "Agriculture Cooperative",
        email: "info@greenharvest.org",
        mobile: "+233 540 987 654",
      },
    },
    {
      address: "0xf9210606957C32E5add4580aa6b56b9CDD2C766f",
      credits: ethers.parseEther("500000"),
      meta: {
        name: "Micro Enterprise Network",
        logo: "/partners/micro-enterprise-network.png",
        description: "Small business loans for emerging markets",
        website: "https://microenterprise.net",
        location: "United States",
        sector: "Microfinance Institution",
        email: "support@microenterprise.net",
        mobile: "+234 803 555 7890",
      },
    },
  ];

  for (const p of partners) {
    await borrowCredit.createCredits(
      p.address,
      { value: JSON.stringify(p.meta) },
      p.credits,
      []
    );
    console.log("Credits created for partner:", p.meta.name);
  }

  // Deploy PoolFactory
  const PoolFactory = await ethers.getContractFactory("PoolFactory");
  const poolFactory = await PoolFactory.deploy();
  console.log("PoolFactory deployed at:", await poolFactory.getAddress());

  const documentsJSON = JSON.stringify([
    {
      name: "Pool Prospectus",
      type: "application/pdf",
      size: 830283,
      date: "Dec 15, 2023",
      url: "/docs/prospectus.pdf",
    },
    {
      name: "Risk Disclosure",
      type: "application/pdf",
      size: 638437,
      date: "Jan 03, 2024",
      url: "/docs/disclosure.pdf",
    },
    {
      name: "Audit Report",
      type: "application/pdf",
      size: 528392,
      date: "Feb 21, 2024",
      url: "/docs/audit-report.pdf",
    },
    {
      name: "Partner Agreement",
      type: "application/pdf",
      size: 284723,
      date: "Mar 10, 2024",
      url: "/docs/partner-agreement.pdf",
    },
    {
      name: "Terms of Service",
      type: "application/pdf",
      size: 934726,
      date: "Apr 05, 2024",
      url: "/docs/terms-of-service.pdf",
    },
  ]);

  const pools = [
    {
      name: "Student Education Fund - Series A",
      description:
        "Supporting university students in emerging markets with affordable education loans",
      symbol: "SEF-A",
      lockPeriodDays: 365,
      borrowAPY: 8.5,
      asset: await usdt.getAddress(),
    },
    {
      name: "Agricultural Development Pool",
      description:
        "Financing small-scale farmers for equipment and crop cultivation",
      symbol: "ADP-1",
      lockPeriodDays: 180,
      borrowAPY: 9.8,
      asset: await ngn.getAddress(),
    },
    {
      name: "Micro Enterprise Growth",
      description:
        "Capital for small businesses and entrepreneurship in developing regions",
      symbol: "MEG-1",
      lockPeriodDays: 270,
      borrowAPY: 12.5,
      asset: usdt.getAddress(),
    },
    {
      name: "Infrastructure Development Bond",
      description: "Long-term financing for essential infrastructure projects",
      symbol: "IDB-1",
      lockPeriodDays: 730,
      borrowAPY: 5.2,
      asset: await ngn.getAddress(),
    },
    {
      name: "Green Energy Initiative",
      description: "Funding renewable energy projects in rural communities",
      symbol: "GEI-1",
      lockPeriodDays: 456,
      borrowAPY: 7.8,
      asset: ethers.ZeroAddress,
    },
  ];

  for (const p of pools) {
    const borrowApyScaled = Math.round(p.borrowAPY * 100);
    const lockPeriodSeconds = p.lockPeriodDays * 24 * 60 * 60;
    const withdrawDelaySeconds = 7 * 24 * 60 * 60;

    await poolFactory.create(
      p.name,
      p.description,
      { value: documentsJSON },
      {
        __html: `
          <h1>Terms &amp; Conditions</h1>
          <p>Detailed terms and conditions for this loan pool</p>
          <h2>Investment Terms</h2>
          <ul>
            <li>Minimum investment: None</li>
            <li>Management fee: 2% annually</li>
            <li>Performance fee: 10% of yields above 8%</li>
            <li>Lock-up period: ${p.lockPeriodDays} days (tradeable NFTs)</li>
          </ul>
          <h2>Risk Disclosure</h2>
          <ul>
            <li>Loan defaults may result in loss of principal</li>
            <li>Returns are not guaranteed</li>
            <li>Currency and regulatory risks apply</li>
            <li>Smart contract risks</li>
          </ul>
        `,
      },
      {
        symbol: p.symbol,
        asset: p.asset,
        credit: await borrowCredit.getAddress(),
        lockPeriod: BigInt(lockPeriodSeconds),
        withdrawDelay: BigInt(withdrawDelaySeconds),
        borrowAPY: BigInt(borrowApyScaled),
      }
    );

    console.log("Pool created:", p.name);
  }

  // Deploy MarketPlace
  const MarketPlace = await ethers.getContractFactory("MarketPlace");
  const marketplace = await MarketPlace.deploy();
  console.log("MarketPlace deployed at:", await marketplace.getAddress());

  // Verify all
  // await verify(usdt.address, []);
  // await verify(oracle.address, []);
  // await verify(borrowCredit.address, [oracle.address]);
  // await verify(borrowCredit.address, [oracle.address]);
  // await verify(poolFactory.address, []);
  // await verify(marketplace.address, []);
}

main();
