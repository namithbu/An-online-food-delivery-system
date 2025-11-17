import axios from 'axios';
import mongoose from 'mongoose';
import foodModel from '../../models/foodModel.js';

const url = process.env.URL || 'http://localhost:4000';
const MONGO = process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/savi_cart_test?authSource=admin';

(async () => {
  try {
    // create a food item directly
    await mongoose.connect(MONGO);
    const food = new foodModel({
      name: `Cart Food ${Date.now()}`,
      description: 'For cart test',
      price: 50,
      image: 'nofile.jpg',
      category: 'test'
    });
    const saved = await food.save();
    await mongoose.disconnect();

    // register and login user
    const email = `cart_user_${Date.now()}@example.com`;
    const password = 'TestPass123';

    await axios.post(`${url}/api/user/register`, { name: 'Cart User', email, password });
    const login = await axios.post(`${url}/api/user/login`, { email, password });
    const token = login.data.token;

    // add to cart
    const addResp = await axios.post(`${url}/api/cart/add`, { itemId: saved._id.toString() }, { headers: { token } });
    if (!addResp.data || !addResp.data.success) {
      console.error('Add to cart failed', addResp.data);
      process.exit(1);
    }

    console.log('Add To Cart functional test: SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('Error in add_to_cart.test.js', err.message || err);
    process.exit(1);
  }
})();
