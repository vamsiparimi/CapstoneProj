import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a product to the cart', () => {
    const product = { _id: '1', name: 'Product 1', price: 100, quantity: 1 };
    service.addToCart(product);
    service.getCartItems().subscribe(cartItems => {
      expect(cartItems.length).toBe(1);
      expect(cartItems[0]._id).toBe('1');
      expect(cartItems[0].quantity).toBe(1);
    });
  });

  it('should update the quantity of an existing product in the cart', () => {
    const product = { _id: '1', name: 'Product 1', price: 100, quantity: 1 };
    service.addToCart(product);
    service.addToCart(product); // Adding the same product again to increase quantity
    service.getCartItems().subscribe(cartItems => {
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].quantity).toBe(2);
    });
  });

  it('should calculate the correct total price', () => {
    const product1 = { _id: '1', name: 'Product 1', price: 100, quantity: 1 };
    const product2 = { _id: '2', name: 'Product 2', price: 200, quantity: 1 };
    service.addToCart(product1);
    service.addToCart(product2);
    service.getTotal().subscribe(total => {
      expect(total).toBe(300); // 100 + 200 = 300
    });
  });

  it('should remove a product from the cart by index', () => {
    const product1 = { _id: '1', name: 'Product 1', price: 100, quantity: 1 };
    const product2 = { _id: '2', name: 'Product 2', price: 200, quantity: 1 };
    service.addToCart(product1);
    service.addToCart(product2);
    service.removeFromCart(0); // Remove the first product
    service.getCartItems().subscribe(cartItems => {
      expect(cartItems.length).toBe(1);
      expect(cartItems[0]._id).toBe('2'); // Only the second product should remain
    });
  });

  it('should update the total price after removing a product', () => {
    const product1 = { _id: '1', name: 'Product 1', price: 100, quantity: 1 };
    const product2 = { _id: '2', name: 'Product 2', price: 200, quantity: 1 };
    service.addToCart(product1);
    service.addToCart(product2);
    service.removeFromCart(0); // Remove the first product
    service.getTotal().subscribe(total => {
      expect(total).toBe(200); // Only the second product's price should be included
    });
  });

  it('should update the product quantity and recalculate total when quantity changes', () => {
    const product = { _id: '1', name: 'Product 1', price: 100, quantity: 1 };
    service.addToCart(product);
    service.updateQuantity(0, 2); // Increase quantity by 2
    service.getCartItems().subscribe(cartItems => {
      expect(cartItems[0].quantity).toBe(3);
    });
    service.getTotal().subscribe(total => {
      expect(total).toBe(300); // 100 * 3 = 300
    });
  });

  it('should remove product from cart if quantity becomes zero or less', () => {
    const product = { _id: '1', name: 'Product 1', price: 100, quantity: 1 };
    service.addToCart(product);
    service.updateQuantity(0, -1); // Decrease quantity by 1, which should remove the item
    service.getCartItems().subscribe(cartItems => {
      expect(cartItems.length).toBe(0); // Cart should be empty
    });
    service.getTotal().subscribe(total => {
      expect(total).toBe(0); // Total should be zero
    });
  });
});
