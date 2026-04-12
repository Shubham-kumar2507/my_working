const Donation = require('../models/Donation');
const Project = require('../models/Project');
const User = require('../models/User');
const { createPaymentIntent, confirmPayment } = require('../utils/paymentService');
const { sendDonationEmail } = require('../utils/emailService');


exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, projectId } = req.body;

       
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

       
        const paymentIntent = await createPaymentIntent(amount * 100, project.currency);

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating payment intent' });
    }
};


exports.confirmDonation = async (req, res) => {
    try {
        const { projectId, amount, paymentIntentId, anonymous, message } = req.body;

       
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const paymentConfirmation = await confirmPayment(paymentIntentId);

       
        const donation = await Donation.create({
            projectId,
            donorId: req.user._id,
            amount,
            paymentIntentId,
            status: 'completed',
            anonymous: anonymous || false,
            message: message || ''
        });

    
        project.currentAmount += amount;
        project.donors.push({
            userId: req.user._id,
            amount,
            date: Date.now(),
            anonymous: anonymous || false
        });

        // Check if project reached goal
        if (project.currentAmount >= project.goalAmount && project.status === 'active') {
            project.status = 'funded';
        }

        await project.save();

        // Update user's donation history
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                donationHistory: {
                    projectId,
                    amount,
                    date: Date.now()
                }
            }
        });

        // Send confirmation email
        sendDonationEmail(req.user.email, project.title, amount);

        res.status(201).json(donation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error confirming donation' });
    }
};


exports.getUserDonations = async (req, res) => {
    try {
        // Ensure user can only see their own donations (unless admin)
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const donations = await Donation.find({ donorId: req.params.userId })
            .populate('projectId', 'title images category')
            .sort({ createdAt: -1 });

        res.json(donations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching donations' });
    }
};


exports.getProjectDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            projectId: req.params.projectId,
            status: 'completed'
        })
            .populate('donorId', 'name profileImage')
            .sort({ createdAt: -1 });

        res.json(donations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching project donations' });
    }
};
