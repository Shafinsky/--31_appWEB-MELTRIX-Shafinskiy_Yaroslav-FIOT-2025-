const router = require("express").Router();
const upload = require("../middleware/upload.middleware");

router.post("/single", upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded", file: req.file });
});

router.post("/multiple", upload.array("files", 5), (req, res) => {
  res.json({ message: "Files uploaded", files: req.files });
});

module.exports = router;