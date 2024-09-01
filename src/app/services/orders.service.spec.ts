import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './orders.service';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Use HttpClientTestingModule for mocking HTTP requests
      providers: [OrderService],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no unmatched requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save a new order', () => {
    const orderDetails = { productId: '1', quantity: 2, userEmail: 'test@example.com' };
    const mockResponse = { success: true, orderId: '12345' };

    service.saveOrder(orderDetails).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/orders');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(orderDetails);
    req.flush(mockResponse); // Simulate the response
  });

  it('should retrieve orders for a user by email', () => {
    const email = 'test@example.com';
    const mockOrders = [
      { orderId: '123', productId: '1', quantity: 2 },
      { orderId: '456', productId: '2', quantity: 1 },
    ];

    service.getUserOrders(email).subscribe((orders) => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`http://localhost:5000/api/orders/user/${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders); // Simulate the response
  });

  it('should retrieve all orders', () => {
    const mockOrders = [
      { orderId: '123', productId: '1', quantity: 2 },
      { orderId: '456', productId: '2', quantity: 1 },
      { orderId: '789', productId: '3', quantity: 5 },
    ];

    service.getAllOrders().subscribe((orders) => {
      expect(orders.length).toBe(3);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/orders/all');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders); // Simulate the response
  });

  it('should handle error when saving an order', () => {
    const orderDetails = { productId: '1', quantity: 2, userEmail: 'test@example.com' };
    const errorMessage = 'Failed to save order';
  
    service.saveOrder(orderDetails).subscribe(
      () => fail('Expected an error, not orders'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      }
    );
  
    const req = httpMock.expectOne('http://localhost:5000/api/orders');
    expect(req.request.method).toBe('POST');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should handle error when retrieving user orders', () => {
    const email = 'test@example.com';
    const errorMessage = 'Failed to retrieve orders';
  
    service.getUserOrders(email).subscribe(
      () => fail('Expected an error, not orders'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    );
  
    const req = httpMock.expectOne(`http://localhost:5000/api/orders/user/${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
  
  
});
