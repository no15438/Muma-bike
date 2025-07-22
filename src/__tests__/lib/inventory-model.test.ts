import {
  ProductStatus,
  getAllProducts,
  getProductById,
  searchProducts,
  getAllCategories,
  getAllSuppliers,
  getSupplierById,
  getCategoryById,
  getProductStatusLabel,
  getProductStatusColor,
  sampleProducts,
  sampleCategories,
  sampleSuppliers
} from '@/lib/inventory/inventory-model';

describe('Inventory Model', () => {
  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = await getAllProducts();
      expect(products).toEqual(expect.arrayContaining(sampleProducts));
      expect(products.length).toBe(sampleProducts.length);
    });
  });

  describe('getProductById', () => {
    it('should return a product when given a valid ID', async () => {
      const product = await getProductById('prod1');
      expect(product).toEqual(sampleProducts[0]);
    });

    it('should return null when given an invalid ID', async () => {
      const product = await getProductById('nonexistent');
      expect(product).toBeNull();
    });
  });

  describe('searchProducts', () => {
    it('should filter products by name', async () => {
      const results = await searchProducts({ name: '山地' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.name.toLowerCase()).toContain('山地');
      });
    });

    it('should filter products by categoryId', async () => {
      const results = await searchProducts({ categoryId: 'cat1' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.categoryId).toBe('cat1');
      });
    });

    it('should filter products by status', async () => {
      const results = await searchProducts({ status: ProductStatus.ACTIVE });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.status).toBe(ProductStatus.ACTIVE);
      });
    });

    it('should filter products by brand', async () => {
      const results = await searchProducts({ brand: '捷安特' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.brand.toLowerCase()).toContain('捷安特');
      });
    });

    it('should filter products by price range', async () => {
      const minPrice = 1000;
      const maxPrice = 3000;
      const results = await searchProducts({ minPrice, maxPrice });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(minPrice);
        expect(product.price).toBeLessThanOrEqual(maxPrice);
      });
    });

    it('should filter products by stock availability', async () => {
      const results = await searchProducts({ inStock: true });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.stockQuantity).toBeGreaterThan(0);
      });
    });

    it('should combine multiple filters', async () => {
      const results = await searchProducts({
        categoryId: 'cat1',
        inStock: true,
        minPrice: 3000
      });
      
      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.categoryId).toBe('cat1');
        expect(product.stockQuantity).toBeGreaterThan(0);
        expect(product.price).toBeGreaterThanOrEqual(3000);
      });
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const categories = await getAllCategories();
      expect(categories).toEqual(expect.arrayContaining(sampleCategories));
      expect(categories.length).toBe(sampleCategories.length);
    });
  });

  describe('getAllSuppliers', () => {
    it('should return all suppliers', async () => {
      const suppliers = await getAllSuppliers();
      expect(suppliers).toEqual(expect.arrayContaining(sampleSuppliers));
      expect(suppliers.length).toBe(sampleSuppliers.length);
    });
  });

  describe('getSupplierById', () => {
    it('should return a supplier when given a valid ID', async () => {
      const supplier = await getSupplierById('sup1');
      expect(supplier).toEqual(sampleSuppliers[0]);
    });

    it('should return null when given an invalid ID', async () => {
      const supplier = await getSupplierById('nonexistent');
      expect(supplier).toBeNull();
    });
  });

  describe('getCategoryById', () => {
    it('should return a category when given a valid ID', async () => {
      const category = await getCategoryById('cat1');
      expect(category).toEqual(sampleCategories[0]);
    });

    it('should return null when given an invalid ID', async () => {
      const category = await getCategoryById('nonexistent');
      expect(category).toBeNull();
    });
  });

  describe('getProductStatusLabel', () => {
    it('should return the correct label for each status', () => {
      expect(getProductStatusLabel(ProductStatus.ACTIVE)).toBe('在售');
      expect(getProductStatusLabel(ProductStatus.OUT_OF_STOCK)).toBe('缺货');
      expect(getProductStatusLabel(ProductStatus.DISCONTINUED)).toBe('已停产');
      expect(getProductStatusLabel(ProductStatus.COMING_SOON)).toBe('即将上市');
    });

    it('should return the status code for unknown status', () => {
      // @ts-ignore - Testing with invalid status
      expect(getProductStatusLabel('unknown')).toBe('unknown');
    });
  });

  describe('getProductStatusColor', () => {
    it('should return the correct color class for each status', () => {
      expect(getProductStatusColor(ProductStatus.ACTIVE)).toBe('bg-green-100 text-green-800');
      expect(getProductStatusColor(ProductStatus.OUT_OF_STOCK)).toBe('bg-yellow-100 text-yellow-800');
      expect(getProductStatusColor(ProductStatus.DISCONTINUED)).toBe('bg-red-100 text-red-800');
      expect(getProductStatusColor(ProductStatus.COMING_SOON)).toBe('bg-blue-100 text-blue-800');
    });

    it('should return default color for unknown status', () => {
      // @ts-ignore - Testing with invalid status
      expect(getProductStatusColor('unknown')).toBe('bg-gray-100 text-gray-800');
    });
  });
}); 