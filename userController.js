const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('createdProjects');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user profile' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        // Check if user is updating their own profile
        if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this profile' });
        }

        const { name, bio, profileImage } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (profileImage !== undefined) updateData.profileImage = profileImage;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

// @desc    Get user's created projects
// @route   GET /api/users/:id/projects
// @access  Public
exports.getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ creatorId: req.params.id })
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user projects' });
    }
};
