import axios from 'axios';
import mongoose from 'mongoose';
import foodModel from '../../models/foodModel.js';

const url = process.env.URL || 'http://localhost:4000';
const MONGO = process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/savi_cart_test?authSource=admin';

(async () => {
  try {
    await mongoose.connect(MONGO);
    const food = new foodModel({
      name: `List Food ${Date.now()}`,
      description: 'For list orders test',
      price: 80,
      image: 'nofile.jpg',
      category: 'test'
    });
    const saved = await food.save();
    await mongoose.disconnect();

    const email = `list_user_${Date.now()}@example.com`;
    const password = 'TestPass123';
    await axios.post(`${url}/api/user/register`, { name: 'List User', email, password });
    const login = await axios.post(`${url}/api/user/login`, { email, password });
    const token = login.data.token;

    // Place an order
    const amount = saved.price + 2;
    const paymentResp = await axios.post(`${url}/api/payment/create`, { amount }, { headers: { token } });
    const paymentId = paymentResp.data.paymentId;
    const items = [{ name: saved.name, price: saved.price, quantity: 1 }];
    const address = { destination: 'xx', additionalInformation: 'yy' };
    await axios.post(`${url}/api/order/place`, { items, amount, address, payment: true, paymentId }, { headers: { token } });

    // Fetch user orders
    const ordersResp = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
    if (!ordersResp.data || !ordersResp.data.data) {
      console.error('List orders failed', ordersResp.data);
      process.exit(1);
    }

    console.log('List Orders functional test: SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('Error in list_orders.test.js', err.message || err);
    process.exit(1);
  }
})();
