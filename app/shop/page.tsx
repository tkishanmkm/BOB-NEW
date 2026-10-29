import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const services=[
 {title:"Recharge and bills",description:"Explore the bill and recharge demo screens.",href:"/recharge",asset:"recharge" as const},
 {title:"Bus tickets",description:"Open the illustrative route-planning preview.",href:"/bus-tickets",asset:"bus" as const},
 {title:"Cards",description:"Review the prototype card information screen.",href:"/cards",asset:"cards" as const},
 {title:"Offers",description:"Browse the local offers screen.",href:"/offers",asset:"offers" as const}
];
export default function ShopPage(){return <Shell>
 <div className="page-heading apk-page-heading"><ApkAssetIcon asset="shop" size={32}/><div><p className="eyebrow">SHOP AND SERVICES</p><h1>Shop</h1><p className="muted">Explore available service previews in BOB-NEW.</p></div></div>
 <div className="notice" role="note"><strong>Prototype only.</strong> This directory does not connect to merchants, service providers, ticketing systems, or payment gateways. No purchase or payment can be completed here.</div>
 <section className="card"><h2>Explore services</h2><div className="service-grid">{services.map(item=><Link className="service-tile" href={item.href} key={item.href}><ApkAssetIcon asset={item.asset} size={28}/><span className="service-copy"><strong>{item.title}</strong><span className="muted">{item.description}</span><span className="service-arrow">Open service →</span></span></Link>)}</div></section>
 <section className="card"><h2>Shop safely</h2><ul><li>Check the merchant and final amount before paying through any official payment app.</li><li>Never share your UPI PIN, card CVV, OTP, or banking password.</li><li>Use verified provider channels for actual orders, tickets, bills, or recharges.</li></ul></section>
 <div className="actions"><Link className="btn secondary" href="/shop-and-pay">Shop and Pay</Link><Link className="btn secondary" href="/help">Help centre</Link></div>
 </Shell>}
