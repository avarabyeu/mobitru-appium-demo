export const users = {
  validUser: {
    email: 'testuser@gmail.com',
    password: 'password1'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  }
};

export const shippingAddress = {
  street: '123 Main Street',
  city: 'New York',
  zipCode: '10001',
  country: 'USA'
};

export const paymentInfo = {
  cardNumber: '4111111111111111',
  expiryDate: '12/25',
  cvv: '123'
};

export const products = {
  testProduct: {
    name: 'Test Product',
    price: '$99.99',
    quantity: 1
  }
};

export default {
  users,
  shippingAddress,
  paymentInfo,
  products
};

