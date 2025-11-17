import mongoose from 'mongoose';
import foodModel from '../../models/foodModel.js';

const MONGO = process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/savi_cart_test?authSource=admin';

(async () => {
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to Mongo for add_food test');

    const food = new foodModel({
      name: `Func Food ${Date.now()}`,
      description: 'Functional test food',
      price: 99,
      image: 'nofile.jpg',
      category: 'test'
    });

    const saved = await food.save();
    console.log('Saved food id:', saved._id.toString());

    const found = await foodModel.findById(saved._id);
    if (!found) {
      console.error('Food not found after insert');
      process.exit(1);
    }

    console.log('Add Food functional test: SUCCESS');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error in add_food.test.js', err.message || err);
    process.exit(1);
  }
})();
