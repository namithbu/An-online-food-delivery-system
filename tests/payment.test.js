import axios from 'axios';
import mongoose from 'mongoose';
import foodModel from '../../models/foodModel.js';

const url = process.env.URL || 'http://localhost:4000';
const MONGO = process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/savi_cart_test?authSource=admin';

(async () => {
  try {
    await mongoose.connect(MONGO);
    const food = new foodModel({
      name: `Payment Food ${Date.now()}`,
      description: 'For payment test',
      price: 200,
      image: 'nofile.jpg',
      category: 'test'
    });
    const saved = await food.save();
    await mongoose.disconnect();

    const email = `payment_user_${Date.now()}@example.com`;
    const password = 'TestPass123';
    await axios.post(`${url}/api/user/register`, { name: 'Payment User', email, password });
    const login = await axios.post(`${url}/api/user/login`, { email, password });
    const token = login.data.token;

    const amount = saved.price + 2;
    const paymentResp = await axios.post(`${url}/api/payment/create`, { amount }, { headers: { token } });
    if (!paymentResp.data || !paymentResp.data.paymentId) {
      console.error('Payment creation failed', paymentResp.data);
      process.exit(1);
    }

    const verifyResp = await axios.post(`${url}/api/payment/verify`, { paymentId: paymentResp.data.paymentId, success: 'true' }, { headers: { token } });
    if (!verifyResp.data || typeof verifyResp.data.paid === 'undefined') {
      console.error('Payment verify failed', verifyResp.data);
      process.exit(1);
    }

    console.log('Payment functional test: SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('Error in payment.test.js', err.message || err);
    process.exit(1);
  }
})();
