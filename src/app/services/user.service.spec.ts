import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Use HttpClientTestingModule for mocking HTTP requests
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no unmatched requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve order history', () => {
    const mockOrderHistory = [
      { orderId: '123', product: 'Product 1', amount: 100 },
      { orderId: '456', product: 'Product 2', amount: 200 },
    ];

    service.getOrderHistory('user1').subscribe((orders) => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrderHistory);
    });

    const req = httpMock.expectOne('/api/orders/history/user1');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrderHistory); // Simulate the response
  });

  it('should retrieve the current order', () => {
    const mockCurrentOrder = { orderId: '789', product: 'Product 3', amount: 300 };

    service.getCurrentOrder('user1').subscribe((order) => {
      expect(order).toEqual(mockCurrentOrder);
    });

    const req = httpMock.expectOne('/api/orders/current/user1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCurrentOrder); // Simulate the response
  });

  it('should handle error when retrieving order history', () => {
    service.getOrderHistory('user1').subscribe(
      () => fail('expected an error, not order history'),
      (error) => expect(error.status).toBe(500)
    );

    const req = httpMock.expectOne('/api/orders/history/user1');
    expect(req.request.method).toBe('GET');
    req.flush('Error occurred', { status: 500, statusText: 'Server Error' }); // Simulate an error response
  });
});
