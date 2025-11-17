import axios from 'axios';
import mongoose from 'mongoose';
import foodModel from '../../models/foodModel.js';

const url = process.env.URL || 'http://localhost:4000';
const MONGO = process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/savi_cart_test?authSource=admin';

(async () => {
  try {
    await mongoose.connect(MONGO);
    const food = new foodModel({
      name: `Remove Food ${Date.now()}`,
      description: 'For remove order test',
      price: 120,
      image: 'nofile.jpg',
      category: 'test'
    });
    const saved = await food.save();
    await mongoose.disconnect();

    const email = `remove_user_${Date.now()}@example.com`;
    const password = 'TestPass123';
    await axios.post(`${url}/api/user/register`, { name: 'Remove User', email, password });
    const login = await axios.post(`${url}/api/user/login`, { email, password });
    const token = login.data.token;

    // Place an order
    const amount = saved.price + 2;
    const paymentResp = await axios.post(`${url}/api/payment/create`, { amount }, { headers: { token } });
    const paymentId = paymentResp.data.paymentId;
    const items = [{ name: saved.name, price: saved.price, quantity: 1 }];
    const address = { destination: 'xx', additionalInformation: 'yy' };
    const placeResp = await axios.post(`${url}/api/order/place`, { items, amount, address, payment: true, paymentId }, { headers: { token } });
    
      // Fetch user's orders to get the order ID (placeOrder endpoint doesn't return it)
      const ordersResp = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
      if (!ordersResp.data || !ordersResp.data.data || ordersResp.data.data.length === 0) {
        console.error('No orders found after placing order');
        process.exit(1);
      }
      const orderId = ordersResp.data.data[ordersResp.data.data.length - 1]._id;

    // Remove the order
      const removeResp = await axios.delete(`${url}/api/order/${orderId}`, { headers: { token } });
    if (!removeResp.data || removeResp.data.success !== true) {
      console.error('Remove order failed', removeResp.data);
      process.exit(1);
    }

    console.log('Remove Order functional test: SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('Error in remove_order.test.js', err.message || err);
    process.exit(1);
  }
})();
