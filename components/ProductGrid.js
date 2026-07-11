'use client';
import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
export default function ProductGrid({products}){const [order,setOrder]=useState('newest');const sorted=useMemo(()=>[...products].sort((a,b)=>order==='low'?a.price-b.price:order==='high'?b.price-a.price:0),[products,order]);return <><div className="shop-toolbar"><p>{products.length} {products.length===1?'piece':'pieces'} to make a space feel special</p><label>Sort by <select value={order} onChange={e=>setOrder(e.target.value)}><option value="newest">Latest additions</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div><div className="grid full-grid">{sorted.map(p=><ProductCard key={p.slug} p={p}/>)}</div></>}
