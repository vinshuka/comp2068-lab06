const viewPath = 'plans';
const Plan = require('../models/plan');
const User = require('../models/user');

exports.index = async (req, res) => {
  try {
    const plans = await Plan
      .find()
      .populate('user')
      .sort({updatedAt: 'desc'});

    res.render(`${viewPath}/index`, {
      pageTitle: 'Archive',
      plans: plans
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying the archive: ${error}`);
    res.redirect('/');
  }
};

exports.show = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
    .populate('user');
      
    res.render(`${viewPath}/show`, {
      pageTitle: plan.title,
      plan: plan
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying this plan: ${error}`);
    res.redirect('/');
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Plan'
  });
};

exports.create = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    
    const plan = await Plan.create({user: user._id, ...req.body});

    req.flash('success', 'Plan created successfully');
    res.redirect(`/plans/${plan.id}`);
  } catch (error) {
    req.flash('danger', `There was an error creating this plan: ${error}`);
    req.session.formData = req.body;
    res.redirect('/plans/new');
  }
};

exports.edit = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: plan.title,
      formData: plan
    });
  } catch (error) {
    req.flash('danger', `There was an error accessing this plan: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let plan = await Plan.findById(req.body.id);
    if (!plan) throw new Error('Plan could not be found');

    const attributes = {user: user._id, ...req.body};
    await Plan.validate(attributes);
    await Plan.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The plan was updated successfully');
    res.redirect(`/plans/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this plan: ${error}`);
    res.redirect(`/plans/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    await Plan.deleteOne({_id: req.body.id});
    req.flash('success', 'The plan was deleted successfully');
    res.redirect(`/plans`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this plan: ${error}`);
    res.redirect(`/plans`);
  }
};