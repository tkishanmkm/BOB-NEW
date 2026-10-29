"use client";
import { useParams } from "next/navigation";
import { FeaturePage } from "@/components/feature-page";
export default function DynamicFeatureRoute(){
 const params=useParams<{feature:string}>();
 const feature=Array.isArray(params.feature)?params.feature[0]:params.feature;
 return <FeaturePage feature={feature}/>;
}
