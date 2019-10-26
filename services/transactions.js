const Transaction = require('../models/transactions');
const Policy = require('../models/policy');
const User = require('../models/users');

module.exports = {
    fetchTransactions: async (userId, page, limit) => {
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
            if (user.coin + coin < 0)
                return { error: new Error('Coins must not be negative!'), value: null };
            let content;
            if (money > 0) content = `Bạn đã nạp ${money}đ để đổi lấy xu`;
            else content = `Bạn đã rút ${money}đ và bị trừ xu`;
            const transaction = new Transaction({
                content,
                amout: coin
            });
            await transaction.save();
            user.coin += coin;
            user.save();
            return { error: null, value: 'Successfully!' };
        }
        catch (err) {
            return { error: err, value: null };
        }
    }
}