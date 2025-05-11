const reviewCode = require("../../ai-modules/code-review/reviewCode");

exports.reviewCode = async (req, res) => {
  const { codeSnippet } = req.body;
  try {
    const review = await reviewCode(codeSnippet);
    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
