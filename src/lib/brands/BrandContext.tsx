'use client'

import { Brand, brands as initialBrands } from '@/lib/data'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type BrandContextType = {
  brands: Brand[]
  getBrand: (id: string) => Brand | undefined
  addBrand: (brand: Omit<Brand, 'id'>) => Brand
  updateBrand: (id: string, brandData: Partial<Omit<Brand, 'id'>>) => Brand | null
  deleteBrand: (id: string) => boolean
}

const BrandContext = createContext<BrandContextType | undefined>(undefined)

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>([])

  // 初始化 - 从localStorage加载品牌信息
  useEffect(() => {
    const savedBrands = localStorage.getItem('brands')
    if (savedBrands) {
      try {
        setBrands(JSON.parse(savedBrands))
      } catch (error) {
        console.error('Error parsing brands from localStorage', error)
        setBrands(initialBrands)
      }
    } else {
      setBrands(initialBrands)
    }
  }, [])

  // 保存到localStorage
  useEffect(() => {
    if (brands.length > 0) {
      localStorage.setItem('brands', JSON.stringify(brands))
    }
  }, [brands])

  // 获取单个品牌
  const getBrand = (id: string) => {
    return brands.find(brand => brand.id === id)
  }

  // 添加品牌
  const addBrand = (brandData: Omit<Brand, 'id'>) => {
    const id = `brand-${Date.now()}`
    const newBrand: Brand = { id, ...brandData }
    
    setBrands(prev => [...prev, newBrand])
    return newBrand
  }

  // 更新品牌
  const updateBrand = (id: string, brandData: Partial<Omit<Brand, 'id'>>) => {
    const brandIndex = brands.findIndex(brand => brand.id === id)
    
    if (brandIndex === -1) {
      return null
    }
    
    const updatedBrand = { ...brands[brandIndex], ...brandData }
    const newBrands = [...brands]
    newBrands[brandIndex] = updatedBrand
    
    setBrands(newBrands)
    return updatedBrand
  }

  // 删除品牌
  const deleteBrand = (id: string) => {
    const brandIndex = brands.findIndex(brand => brand.id === id)
    
    if (brandIndex === -1) {
      return false
    }
    
    const newBrands = brands.filter(brand => brand.id !== id)
    setBrands(newBrands)
    return true
  }

  return (
    <BrandContext.Provider value={{
      brands,
      getBrand,
      addBrand,
      updateBrand,
      deleteBrand
    }}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrands() {
  const context = useContext(BrandContext)
  if (context === undefined) {
    throw new Error('useBrands must be used within a BrandProvider')
  }
  return context
} 