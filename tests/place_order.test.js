import axios from 'axios';
import mongoose from 'mongoose';
import foodModel from '../../models/foodModel.js';

const url = process.env.URL || 'http://localhost:4000';
const MONGO = process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/savi_cart_test?authSource=admin';

(async () => {
  try {
    await mongoose.connect(MONGO);
    const food = new foodModel({
      name: `Order Food ${Date.now()}`,
      description: 'For order test',
      price: 120,
      image: 'nofile.jpg',
      category: 'test'
    });
    const saved = await food.save();
    await mongoose.disconnect();

    // register and login
    const email = `order_user_${Date.now()}@example.com`;
    const password = 'TestPass123';
    await axios.post(`${url}/api/user/register`, { name: 'Order User', email, password });
    const login = await axios.post(`${url}/api/user/login`, { email, password });
    const token = login.data.token;

    // create mock payment
    const amount = 120 + 2;
    const paymentResp = await axios.post(`${url}/api/payment/create`, { amount }, { headers: { token } });
    if (!paymentResp.data || !paymentResp.data.paymentId) {
      console.error('Payment create failed', paymentResp.data);
      process.exit(1);
    }

    const paymentId = paymentResp.data.paymentId;

    // place order
    const items = [{ name: saved.name, price: saved.price, quantity: 1 }];
    const address = { destination: 'Test Destination', additionalInformation: 'Leave at door' };

    const orderResp = await axios.post(`${url}/api/order/place`, { items, amount, address, payment: true, paymentId }, { headers: { token } });
    if (!orderResp.data || !orderResp.data.success) {
      console.error('Place order failed', orderResp.data);
      process.exit(1);
    }

    console.log('Place Order functional test: SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('Error in place_order.test.js', err.message || err);
    process.exit(1);
  }
})();
