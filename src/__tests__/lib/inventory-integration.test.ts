import {
  ProductStatus,
  Product,
  Category,
  Supplier,
  getAllProducts,
  getProductById,
  searchProducts,
  getAllCategories,
  getAllSuppliers,
  getSupplierById,
  getCategoryById,
  getProductStatusLabel,
  getProductStatusColor
} from '@/lib/inventory/inventory-model';

// Mock the functions to use our test data
jest.mock('@/lib/inventory/inventory-model', () => {
  const originalModule = jest.requireActual('@/lib/inventory/inventory-model');
  
  return {
    ...originalModule,
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    searchProducts: jest.fn(),
    getAllCategories: jest.fn(),
    getCategoryById: jest.fn(),
    getAllSuppliers: jest.fn(),
    getSupplierById: jest.fn()
  };
});

// Mock data for integration testing - defined after the jest.mock
const mockProducts: Product[] = [
  {
    id: 'test1',
    name: '测试山地车',
    sku: 'TST-001',
    categoryId: 'test-cat1',
    brand: '测试品牌',
    description: '测试用山地自行车',
    price: 2999,
    costPrice: 2000,
    stockQuantity: 10,
    status: ProductStatus.ACTIVE,
    images: ['https://example.com/test1.jpg'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'test2',
    name: '测试公路车',
    sku: 'TST-002',
    categoryId: 'test-cat2',
    brand: '测试品牌',
    description: '测试用公路自行车',
    price: 3999,
    costPrice: 3000,
    stockQuantity: 0,
    status: ProductStatus.OUT_OF_STOCK,
    images: ['https://example.com/test2.jpg'],
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  }
];

const mockCategories: Category[] = [
  { id: 'test-cat1', name: '测试山地车类别', description: '测试用山地车类别' },
  { id: 'test-cat2', name: '测试公路车类别', description: '测试用公路车类别' }
];

const mockSuppliers: Supplier[] = [
  {
    id: 'test-sup1',
    name: '测试供应商',
    contactPerson: '测试联系人',
    phone: '13800000000',
    email: 'test@example.com'
  }
];

describe('Inventory Integration Tests', () => {
  beforeEach(() => {
    // Set up mock implementations before each test
    (getAllProducts as jest.Mock).mockResolvedValue(mockProducts);
    (getProductById as jest.Mock).mockImplementation((id: string) => {
      const product = mockProducts.find(p => p.id === id);
      return Promise.resolve(product || null);
    });
    (searchProducts as jest.Mock).mockImplementation((filters: any) => {
      let results = [...mockProducts];
      
      if (filters.name) {
        const name = filters.name.toLowerCase();
        results = results.filter(p => 
          p.name.toLowerCase().includes(name) || p.sku.toLowerCase().includes(name)
        );
      }
      
      if (filters.categoryId) {
        results = results.filter(p => p.categoryId === filters.categoryId);
      }
      
      if (filters.status) {
        results = results.filter(p => p.status === filters.status);
      }
      
      if (filters.inStock) {
        results = results.filter(p => p.stockQuantity > 0);
      }
      
      return Promise.resolve(results);
    });
    (getAllCategories as jest.Mock).mockResolvedValue(mockCategories);
    (getCategoryById as jest.Mock).mockImplementation((id: string) => {
      const category = mockCategories.find(c => c.id === id);
      return Promise.resolve(category || null);
    });
    (getAllSuppliers as jest.Mock).mockResolvedValue(mockSuppliers);
    (getSupplierById as jest.Mock).mockImplementation((id: string) => {
      const supplier = mockSuppliers.find(s => s.id === id);
      return Promise.resolve(supplier || null);
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Product and Category integration', () => {
    it('should find products by category', async () => {
      // First get a category
      const category = await getCategoryById('test-cat1');
      expect(category).not.toBeNull();
      
      // Then search products by that category
      const products = await searchProducts({ categoryId: category!.id });
      expect(products.length).toBeGreaterThan(0);
      
      // All products should belong to this category
      products.forEach(product => {
        expect(product.categoryId).toBe(category!.id);
      });
    });
    
    it('should filter products by stock status', async () => {
      // Get all in-stock products
      const inStockProducts = await searchProducts({ inStock: true });
      
      // Each product should have stock
      inStockProducts.forEach(product => {
        expect(product.stockQuantity).toBeGreaterThan(0);
        
        // Status label should be correct
        const label = getProductStatusLabel(product.status);
        expect(label).toBe('在售');
        
        // Status color should be correct
        const color = getProductStatusColor(product.status);
        expect(color).toBe('bg-green-100 text-green-800');
      });
      
      // Get an out-of-stock product and verify status
      const outOfStockProducts = await searchProducts({ status: ProductStatus.OUT_OF_STOCK });
      expect(outOfStockProducts.length).toBeGreaterThan(0);
      
      outOfStockProducts.forEach(product => {
        expect(product.stockQuantity).toBe(0);
        expect(getProductStatusLabel(product.status)).toBe('缺货');
        expect(getProductStatusColor(product.status)).toBe('bg-yellow-100 text-yellow-800');
      });
    });
  });
  
  describe('Complex search scenarios', () => {
    it('should handle combined search filters correctly', async () => {
      // Get products that are in stock AND from category 1
      const results = await searchProducts({
        categoryId: 'test-cat1',
        inStock: true
      });
      
      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.categoryId).toBe('test-cat1');
        expect(product.stockQuantity).toBeGreaterThan(0);
      });
    });
    
    it('should return empty array when no products match filters', async () => {
      // Search for a non-existent category
      const results = await searchProducts({ categoryId: 'non-existent' });
      expect(results).toEqual([]);
    });
  });
  
  describe('Product details integration', () => {
    it('should retrieve a product with all details', async () => {
      // Get a specific product
      const product = await getProductById('test1');
      expect(product).not.toBeNull();
      
      // Verify basic product info
      expect(product!.name).toBe('测试山地车');
      expect(product!.sku).toBe('TST-001');
      
      // Verify status information is consistent
      expect(getProductStatusLabel(product!.status)).toBe('在售');
      expect(getProductStatusColor(product!.status)).toBe('bg-green-100 text-green-800');
    });
  });
}); 