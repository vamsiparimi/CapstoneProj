import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all products', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ];

    service.getAllProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts); 
  });

  it('should create a new product', () => {
    const newProduct = { name: 'Product 3', price: 300 };
    const mockResponse = { id: '3', ...newProduct };

    service.createProduct(newProduct).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(mockResponse); 
  });

  it('should handle error when deleting a product', () => {
    service.deleteProduct('1').subscribe(
      () => fail('expected an error, not success'),
      (error) => expect(error.status).toBe(404)
    );

    const req = httpMock.expectOne('http://localhost:5000/api/products/1');
    expect(req.request.method).toBe('DELETE');
    req.flush('Product not found', { status: 404, statusText: 'Not Found' }); 
  });
});
