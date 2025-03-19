'use client'

import React from 'react'

export default function BackToProductsButton() {
  return (
    <button 
      onClick={() => window.location.href = '/products'}
      className="btn"
    >
      查看全部商品
    </button>
  )
} 