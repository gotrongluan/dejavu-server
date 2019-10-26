const Transaction = require('../models/transactions');
const Policy = require('../models/policy');
const User = require('../models/users');
const Fawn = require('fawn');

module.exports = {
    getTransactions: async (userId, page, limit) => {
        try {
            const transactions
                = await Transaction.find({ user: userId })
                    .sort({ createdAt: - 1})
                    .skip((page - 1) * limit)
                    .limit(limit);
            return { error: null, value: transactions };
        }
        catch (err) {
            return { error: err, value: null };
        }
    },
    buyCoins: async (userId, money) => {
        try {
            const convert = await Policy.findOne({ money: Math.abs(money) });
            if (!convert)
                return { error: new Error('Your money is invalid!'), value: null };
            const coin = money > 0 ? convert.coin : -convert.coin;
            const user = await User.findById(userId);
            const finalCoin = user.coin + coin;
            if (finalCoin < 0)
                return { error: new Error('Coins must not be negative!'), value: null };
            let content;
            if (money > 0) content = `Bạn đã nạp ${money}đ để đổi lấy xu`;
            else content = `Bạn đã rút ${money}đ và bị trừ xu`;
            const transaction = new Transaction({
                content,
                amount: coin,
                user: userId,
                createdAt: Date.now()
            });
            await Fawn.Task()
                .save('transactions', transaction)
                .update('users', { _id: userId }, {
                    $set: {
                        coin: finalCoin
                    }
                })
                .run();
            return {
                error: null,
                value: {
                    status: 'Successfully',
                    coin: finalCoin
                }
            };
                
        }
        catch (err) {
            return { error: err, value: null };
        }
    }
}