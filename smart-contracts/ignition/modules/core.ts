// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther, parseUnits, zeroAddress } from "viem";

const partners = [
  {
    id: "partner_1",
    address: "0x081E56Ea7935e04Cc8B250D49486162c232091be",
    credits: parseEther("1000000"),
    name: "EduFund Africa",
    logo: "/partners/edufund.png",
    description: "Supporting education across Africa through microfinance",
    website: "https://edufund-africa.org",
    location: "Kenya",
    sector: "Education Cooperative",
    email: "contact@edufund.africa",
    mobile: "+254 700 123 456",
  },
  {
    id: "partner_2",
    address: "0x3E646e062F05e01e1860eA53a6DC81e7E9162DE6",
    credits: parseEther("750000"),
    name: "Green Harvest Co-op",
    logo: "/partners/greenharvest.png",
    description: "Agricultural financing for sustainable farming",
    website: "https://greenharvest-coop.org",
    location: "Singapore",
    sector: "Agriculture Cooperative",
    email: "info@greenharvest.org",
    mobile: "+233 540 987 654",
  },
  {
    id: "partner_3",
    address: "0xf9210606957C32E5add4580aa6b56b9CDD2C766f",
    credits: parseEther("500000"),
    name: "Micro Enterprise Network",
    logo: "/partners/microenterprise.png",
    description: "Small business loans for emerging markets",
    website: "https://microenterprise.net",
    location: "United States",
    sector: "Microfinance Institution",
    email: "support@microenterprise.net",
    mobile: "+234 803 555 7890",
  },
];

// const whiteListedPools = [];

const CoreModule = buildModule("CoreModule", (m) => {
  const usdt = m.contract("USDT");
  const oracle = m.contract("Oracle");

  m.call(usdt, "faucet", [m.getAccount(0), parseUnits("1000", 6)]);

  m.call(oracle, "setCreditToAsset", [usdt, parseEther("0.98")], {
    id: "usdt",
  });

  m.call(oracle, "setCreditToAsset", [zeroAddress, parseEther("0.52")], {
    id: "native",
  });

  const borrowCredit = m.contract("BorrowCredit", [oracle]);

  for (const partner of partners) {
    m.call(
      borrowCredit,
      "createCredits",
      [
        partner.address,
        {
          value: JSON.stringify({
            name: partner.name,
            logo: partner.logo,
            description: partner.description,
            website: partner.website,
            location: partner.location,
            sector: partner.sector,
            email: partner.email,
            mobile: partner.mobile,
          }),
        },
        partner.credits,
      ],
      {
        id: `${partner.id}`,
      }
    );
  }

  // for (const pool of whiteListedPools) {
  //   m.call(borrowCredit, "addToWhitelist", [pool], { id: `whitelist_${pool}` });
  // }

  return { usdt, borrowCredit };
});

export default CoreModule;
