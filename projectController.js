const Project = require('../models/Project');
const User = require('../models/User');
const { sendProjectCreatedEmail } = require('../utils/emailService');

// @desc    Get all projects with filters
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
    try {
        const { category, status, search, sort } = req.query;
        const query = {};

        // Apply filters
        if (category) query.category = category;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Determine sort order
        let sortOption = { createdAt: -1 }; // Default: newest first
        if (sort === 'ending_soon') sortOption = { endDate: 1 };
        if (sort === 'most_funded') sortOption = { currentAmount: -1 };

        const projects = await Project.find(query)
            .populate('creatorId', 'name email profileImage')
            .sort(sortOption)
            .limit(50);

        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching projects' });
    }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('creatorId', 'name email profileImage bio')
            .populate('donors.userId', 'name profileImage');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching project' });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Creator/Admin)
exports.createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            goalAmount,
            currency,
            endDate,
            location,
            images,
            videoUrl,
            tags,
            milestones
        } = req.body;

        const project = await Project.create({
            title,
            description,
            category,
            creatorId: req.user._id,
            goalAmount,
            currency: currency || 'USD',
            endDate,
            location,
            images: images || [],
            videoUrl: videoUrl || '',
            tags: tags || [],
            milestones: milestones || []
        });

        // Add project to user's createdProjects
        await User.findByIdAndUpdate(req.user._id, {
            $push: { createdProjects: project._id }
        });

        // Send email notification
        sendProjectCreatedEmail(req.user.email, project.title);

        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating project' });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Creator only)
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the creator
        if (project.creatorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating project' });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Creator only)
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the creator
        if (project.creatorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }

        await Project.findByIdAndDelete(req.params.id);

        // Remove from user's createdProjects
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { createdProjects: project._id }
        });

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting project' });
    }
};

// @desc    Add project update
// @route   POST /api/projects/:id/updates
// @access  Private (Creator only)
exports.addProjectUpdate = async (req, res) => {
    try {
        const { title, content, images } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the creator
        if (project.creatorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        project.updates.push({
            title,
            content,
            images: images || [],
            date: Date.now()
        });

        await project.save();

        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding update' });
    }
};
