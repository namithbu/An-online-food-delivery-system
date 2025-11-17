import axios from 'axios';
import mongoose from 'mongoose';
import foodModel from '../../models/foodModel.js';

const url = process.env.URL || 'http://localhost:4000';
const MONGO = process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/savi_cart_test?authSource=admin';

(async () => {
  try {
    // create a food item directly in DB
    await mongoose.connect(MONGO);
    const food = new foodModel({
      name: `Cart Food ${Date.now()}`,
      description: 'For cart ops test',
      price: 60,
      image: 'nofile.jpg',
      category: 'test'
    });
    const saved = await food.save();
    await mongoose.disconnect();

    // register and login a user
    const email = `cart_user_${Date.now()}@example.com`;
    const password = 'TestPass123';
    await axios.post(`${url}/api/user/register`, { name: 'Cart User', email, password });
    const login = await axios.post(`${url}/api/user/login`, { email, password });
    const token = login.data.token;

    // Add to cart
    const addResp = await axios.post(`${url}/api/cart/add`, { itemId: saved._id.toString() }, { headers: { token } });
    if (!addResp.data || addResp.data.success !== true) {
      console.error('Add to cart failed', addResp.data);
      process.exit(1);
    }

    // Get cart
    const getResp = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
    if (!getResp.data || !getResp.data.cartData) {
      console.error('Get cart failed', getResp.data);
      process.exit(1);
    }

    // Remove from cart
    const removeResp = await axios.post(`${url}/api/cart/remove`, { itemId: saved._id.toString() }, { headers: { token } });
    if (!removeResp.data || removeResp.data.success !== true) {
      console.error('Remove from cart failed', removeResp.data);
      process.exit(1);
    }

    console.log('Cart operations functional test: SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('Error in cart_operations.test.js', err.message || err);
    process.exit(1);
  }
})();
