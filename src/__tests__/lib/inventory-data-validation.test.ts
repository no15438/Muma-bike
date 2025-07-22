import {
  ProductStatus,
  Product,
  Category,
  Supplier,
  StockMovement
} from '@/lib/inventory/inventory-model';

describe('Inventory Data Structure Validation', () => {
  describe('Product Status Enum', () => {
    it('should have the correct status values', () => {
      expect(ProductStatus.ACTIVE).toBe('active');
      expect(ProductStatus.OUT_OF_STOCK).toBe('out_of_stock');
      expect(ProductStatus.DISCONTINUED).toBe('discontinued');
      expect(ProductStatus.COMING_SOON).toBe('coming_soon');
      
      // Check that we have exactly 4 status values
      expect(Object.keys(ProductStatus).length).toBe(4);
    });
  });
  
  describe('Product Interface', () => {
    // Create a minimal valid product
    const createValidProduct = (): Product => ({
      id: 'test-id',
      name: '测试产品',
      sku: 'TEST-001',
      categoryId: 'cat1',
      brand: '测试品牌',
      description: '测试描述',
      price: 1000,
      costPrice: 800,
      stockQuantity: 10,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/test.jpg'],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    });
    
    it('should accept a minimal valid product', () => {
      const product = createValidProduct();
      
      // TypeScript will enforce this at compile time,
      // but we can make some runtime checks as well
      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.sku).toBeDefined();
      expect(product.price).toBeGreaterThan(0);
      expect(product.status).toBe(ProductStatus.ACTIVE);
    });
    
    it('should accept optional fields', () => {
      const product = createValidProduct();
      
      // Add some optional fields
      const enhancedProduct: Product = {
        ...product,
        salePrice: 900,
        specifications: { '颜色': '红色', '尺寸': 'M' },
        attributes: { '材质': '铝合金', '重量': '10kg' },
        supplierId: 'sup1',
        minStock: 5
      };
      
      expect(enhancedProduct.salePrice).toBe(900);
      expect(enhancedProduct.specifications).toHaveProperty('颜色', '红色');
      expect(enhancedProduct.attributes).toHaveProperty('材质', '铝合金');
      expect(enhancedProduct.supplierId).toBe('sup1');
      expect(enhancedProduct.minStock).toBe(5);
    });
    
    it('should handle relationships correctly', () => {
      const product = createValidProduct();
      
      // Add related objects
      const category: Category = {
        id: 'cat1',
        name: '测试类别',
        description: '测试类别描述'
      };
      
      const supplier: Supplier = {
        id: 'sup1',
        name: '测试供应商',
        contactPerson: '测试联系人',
        phone: '13800000000'
      };
      
      const enhancedProduct: Product = {
        ...product,
        category,
        supplierId: 'sup1',
        supplier
      };
      
      expect(enhancedProduct.category).toBe(category);
      expect(enhancedProduct.category?.id).toBe(product.categoryId);
      expect(enhancedProduct.supplier).toBe(supplier);
      expect(enhancedProduct.supplierId).toBe(supplier.id);
    });
  });
  
  describe('Category Interface', () => {
    it('should accept a minimal valid category', () => {
      const category: Category = {
        id: 'test-cat',
        name: '测试类别'
      };
      
      expect(category).toBeDefined();
      expect(category.id).toBeDefined();
      expect(category.name).toBeDefined();
    });
    
    it('should accept a category with optional fields', () => {
      const category: Category = {
        id: 'test-cat',
        name: '测试类别',
        description: '测试类别描述',
        parentId: 'parent-cat',
        showOnHomepage: true
      };
      
      expect(category.description).toBe('测试类别描述');
      expect(category.parentId).toBe('parent-cat');
      expect(category.showOnHomepage).toBe(true);
    });
  });
  
  describe('Supplier Interface', () => {
    it('should accept a minimal valid supplier', () => {
      const supplier: Supplier = {
        id: 'test-sup',
        name: '测试供应商',
        contactPerson: '测试联系人',
        phone: '13800000000'
      };
      
      expect(supplier).toBeDefined();
      expect(supplier.id).toBeDefined();
      expect(supplier.name).toBeDefined();
      expect(supplier.contactPerson).toBeDefined();
      expect(supplier.phone).toBeDefined();
    });
    
    it('should accept a supplier with optional fields', () => {
      const supplier: Supplier = {
        id: 'test-sup',
        name: '测试供应商',
        contactPerson: '测试联系人',
        phone: '13800000000',
        email: 'test@example.com',
        wechat: 'test_wechat',
        address: '测试地址'
      };
      
      expect(supplier.email).toBe('test@example.com');
      expect(supplier.wechat).toBe('test_wechat');
      expect(supplier.address).toBe('测试地址');
    });
  });
  
  describe('StockMovement Interface', () => {
    it('should accept a valid stock movement', () => {
      const stockMovement: StockMovement = {
        id: 'move1',
        productId: 'prod1',
        type: 'in',
        quantity: 10,
        reason: 'purchase',
        performedBy: 'user1',
        performedAt: '2023-01-01T00:00:00Z'
      };
      
      expect(stockMovement).toBeDefined();
      expect(stockMovement.id).toBeDefined();
      expect(stockMovement.productId).toBeDefined();
      expect(stockMovement.type).toMatch(/^(in|out)$/);
      expect(stockMovement.reason).toMatch(/^(purchase|sale|return|damage|adjustment)$/);
      expect(stockMovement.quantity).toBeGreaterThan(0);
      expect(stockMovement.performedBy).toBeDefined();
      expect(stockMovement.performedAt).toBeDefined();
    });
    
    it('should accept optional fields for stock movement', () => {
      const stockMovement: StockMovement = {
        id: 'move1',
        productId: 'prod1',
        type: 'out',
        quantity: 5,
        reason: 'sale',
        relatedOrderId: 'order1',
        notes: '客户购买',
        performedBy: 'user1',
        performedAt: '2023-01-01T00:00:00Z'
      };
      
      expect(stockMovement.relatedOrderId).toBe('order1');
      expect(stockMovement.notes).toBe('客户购买');
    });
    
    it('should accept a related product', () => {
      const product: Product = {
        id: 'prod1',
        name: '测试产品',
        sku: 'TEST-001',
        categoryId: 'cat1',
        brand: '测试品牌',
        description: '测试描述',
        price: 1000,
        costPrice: 800,
        stockQuantity: 10,
        status: ProductStatus.ACTIVE,
        images: ['https://example.com/test.jpg'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };
      
      const stockMovement: StockMovement = {
        id: 'move1',
        productId: 'prod1',
        product,
        type: 'in',
        quantity: 10,
        reason: 'purchase',
        performedBy: 'user1',
        performedAt: '2023-01-01T00:00:00Z'
      };
      
      expect(stockMovement.product).toBe(product);
      expect(stockMovement.productId).toBe(product.id);
    });
  });
}); 