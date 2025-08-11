// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { zeroAddress } from "viem";
import CoreModule from "./core";

const FactoryModule = buildModule("FactoryModule", (m) => {
  const poolFactory = m.contract("PoolFactory");

  const { usdt, borrowCredit } = m.useModule(CoreModule);

  const documentsJSON = JSON.stringify([
    {
      name: "Pool Prospectus",
      type: "application/pdf",
      size: 123456,
      date: "Dec 15, 2023",
      url: "/docs/prospectus.pdf",
    },
    {
      name: "Risk Disclosure",
      type: "application/pdf",
      size: 123456,
      date: "Jan 03, 2024",
      url: "/docs/disclosure.pdf",
    },
    {
      name: "Audit Report",
      type: "application/pdf",
      size: 123456,
      date: "Feb 21, 2024",
      url: "/docs/audit-report.pdf",
    },
    {
      name: "Partner Agreement",
      type: "application/pdf",
      size: 123456,
      date: "Mar 10, 2024",
      url: "/docs/partner-agreement.pdf",
    },
    {
      name: "Terms of Service",
      type: "application/pdf",
      size: 123456,
      date: "Apr 05, 2024",
      url: "/docs/terms-of-service.pdf",
    },
  ]);

  const pools = [
    {
      id: "pool_1",
      name: "Student Education Fund - Series A",
      description:
        "Supporting university students in emerging markets with affordable education loans",
      symbol: "SEF-A",
      lockPeriodDays: 365,
      borrowAPY: 8.5,
      asset: usdt,
    },
    {
      id: "pool_2",
      name: "Agricultural Development Pool",
      description:
        "Financing small-scale farmers for equipment and crop cultivation",
      symbol: "ADP-1",
      lockPeriodDays: 180,
      borrowAPY: 9.8,
      asset: zeroAddress,
    },
    {
      id: "pool_3",
      name: "Micro Enterprise Growth",
      description:
        "Capital for small businesses and entrepreneurship in developing regions",
      symbol: "MEG-1",
      lockPeriodDays: 270,
      borrowAPY: 12.5,
      asset: usdt,
    },
    {
      id: "pool_4",
      name: "Infrastructure Development Bond",
      description: "Long-term financing for essential infrastructure projects",
      symbol: "IDB-1",
      lockPeriodDays: 730,
      borrowAPY: 5.2,
      asset: zeroAddress,
    },
    {
      id: "pool_5",
      name: "Green Energy Initiative",
      description: "Funding renewable energy projects in rural communities",
      symbol: "GEI-1",
      lockPeriodDays: 456,
      borrowAPY: 7.8,
      asset: zeroAddress,
    },
  ];

  // Create each pool via the factory
  pools.forEach((p) => {
    const borrowApyScaled = Math.round(p.borrowAPY * 100);
    const lockPeriodSeconds = (p.lockPeriodDays ?? 0) * 24 * 60 * 60;
    const withdrawDelaySeconds = 7 * 24 * 60 * 60;

    m.call(
      poolFactory,
      "create",
      [
        p.name,
        p.description,
        {
          value: documentsJSON,
        },
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
          credit: borrowCredit,
          lockPeriod: lockPeriodSeconds,
          withdrawDelay: withdrawDelaySeconds,
          borrowAPY: borrowApyScaled,
        },
      ],
      { id: p.id }
    );
  });

  return { poolFactory };
});

export default FactoryModule;
