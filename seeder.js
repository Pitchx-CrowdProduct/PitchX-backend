const mongoose = require('mongoose');
const PaymentPlans = require('./models/paymentPlans'); // Adjust the path as necessary

// Replace the following connection string with your MongoDB connection string
// const mongoURI = 'mongodb+srv://pitchX:@cluster0.fufficg.mongodb.net/pitchX?retryWrites=true&w=majority&appName=Cluster0/pitchx';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedPaymentPlans = async () => {
  try {
    // Clear existing documents
    await PaymentPlans.deleteMany({});

    // Define the seed data
    const plans = [
      {
        name: 'Basic Plan',
        amount: 10.00,
        duration: '1 month',
        description: 'Basic access to the platform features for one month.',
      },
      {
        name: 'Standard Plan',
        amount: 25.00,
        duration: '3 months',
        description: 'Standard access to the platform features for three months.',
      },
      // {
      //   name: 'Premium Plan',
      //   amount: '50.00',
      //   duration: '6 months',
      //   description: 'Premium access to all platform features for six months.',
      // },
      // {
      //   name: 'Annual Plan',
      //   amount: '90.00',
      //   duration: '1 year',
      //   description: 'Full access to all platform features for one year.',
      // },
    ];

    // Insert the seed data
    await PaymentPlans.insertMany(plans);
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

seedPaymentPlans();
