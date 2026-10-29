"use client";

import Image from "next/image";

export type AssetKey = "transfer" | "passbook" | "beneficiaries" | "account" | "statement" | "settings" | "billPay" | "cards" | "upi" | "fixedDeposit" | "offers" | "help" | "recharge" | "scan" | "loan" | "profile" | "security" | "complaints" | "bus" | "video" | "shop" | "alerts" | "faq";
type AssetEntry = { src: string; fallback?: never } | { src?: never; fallback: string };

const assets: Record<AssetKey, AssetEntry> = {
  transfer: { src: "/assets/bob-world/original-assets/assets/images/sendMoney/bank_transfer_icon.svg" },
  passbook: { src: "/assets/bob-world/original-assets/assets/images/transactionHistory/history.svg" },
  beneficiaries: { src: "/assets/bob-world/original-assets/assets/images/dashBoard/beneficiary.svg" },
  account: { src: "/assets/bob-world/original-assets/assets/images/dashBoard/bank.svg" },
  statement: { src: "/assets/bob-world/original-assets/assets/images/dashBoard/transcationHistory.svg" },
  settings: { src: "/assets/bob-world/original-assets/assets/images/mySpace/accountManagement.svg" },
  billPay: { src: "/assets/bob-world/original-assets/assets/images/dashBoard/billPayment.svg" },
  cards: { src: "/assets/bob-world/original-assets/assets/images/cardDetails/bob_card_icon.svg" },
  upi: { src: "/assets/bob-world/original-assets/assets/images/dashBoard/upi.svg" },
  fixedDeposit: { src: "/assets/bob-world/original-assets/assets/images/mySpace/save.svg" },
  offers: { src: "/assets/bob-world/original-assets/assets/images/mySpace/earn.svg" },
  help: { src: "/assets/bob-world/original-assets/assets/images/dashBoard/needHelp.svg" },
  recharge: { src: "/assets/bob-world/original-assets/assets/images/activateUpi/mobile_icon.svg" },
  scan: { src: "/assets/bob-world/original-assets/assets/images/activateUpi/scanner_icon.svg" },
  loan: { src: "/assets/bob-world/original-assets/assets/images/rechargesAndBills/loan_icon.svg" },
  profile: { src: "/assets/bob-world/original-assets/assets/images/mySpace/personalDetails.svg" },
  security: { src: "/assets/bob-world/original-assets/assets/images/profileManagement/lock.svg" },
  complaints: { src: "/assets/bob-world/original-assets/assets/images/bbps_raise_complaint/complaint_info_icon.svg" },
  bus: { fallback: "BUS" },
  video: { src: "/assets/bob-world/original-assets/assets/images/dashBoard/contact.svg" },
  shop: { src: "/assets/bob-world/original-assets/assets/images/activateUpi/shop_icon.svg" },
  alerts: { src: "/assets/bob-world/original-assets/assets/images/dashBoard/alerts.svg" },
  faq: { src: "/assets/bob-world/original-assets/assets/images/vpaExist/faq.svg" },
};

export function ApkAssetIcon({ asset, size = 26, className = "" }: { asset: AssetKey; size?: number; className?: string }) {
  const entry = assets[asset];
  return <span className={`apk-asset-icon ${className}`} aria-hidden="true">
    {entry.src ? <Image src={entry.src} alt="" width={size} height={size} /> : <span className="apk-asset-fallback">{entry.fallback}</span>}
  </span>;
}
