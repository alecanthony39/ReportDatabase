// Build an apiRouter using express Router
const express = require("express");
const apiRouter = express.Router();

// Import the database adapter functions from the db
const {
  getOpenReports,
  createReport,
  closeReport,
  createReportComment,
} = require("../db");

/**
 * Set up a GET request for /reports
 *
 * - it should use an async function
 * - it should await a call to getOpenReports
 * - on success, it should send back an object like { reports: theReports }
 * - on caught error, call next(error)
 */

apiRouter.get("/reports", async (req, res, next) => {
  try {
    const reports = await getOpenReports();

    if (!reports) {
      next(error);
    }

    res.send({
      reports,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

/**
 * Set up a POST request for /reports
 *
 * - it should use an async function
 * - it should await a call to createReport, passing in the fields from req.body
 * - on success, it should send back the object returned by createReport
 * - on caught error, call next(error)
 */

apiRouter.post("/reports", async (req, res, next) => {
  const { title, description, location, password } = req.body;
  const reportData = {};
  try {
    reportData.password = password;
    reportData.title = title;
    reportData.description = description;
    reportData.location = location;

    const report = await createReport(reportData);

    if (!report) {
      next(error);
    }

    res.send(report);
  } catch (error) {
    next(error);
  }
});

/**
 * Set up a DELETE request for /reports/:reportId
 *
 * - it should use an async function
 * - it should await a call to closeReport, passing in the reportId from req.params
 *   and the password from req.body
 * - on success, it should send back the object returned by closeReport
 * - on caught error, call next(error)
 */

apiRouter.delete("/reports/:reportId", async (req, res, next) => {
  try {
    const report = await closeReport(req.params.reportId, req.body.password);

    res.send(report);
  } catch (error) {
    next(error);
  }
});

/**
 * Set up a POST request for /reports/:reportId/comments
 *
 * - it should use an async function
 * - it should await a call to createReportComment, passing in the reportId and
 *   the fields from req.body
 * - on success, it should send back the object returned by createReportComment
 * - on caught error, call next(error)
 */
apiRouter.post("/reports/:reportId/comments", async (req, res, next) => {
  try {
    const comment = await createReportComment(req.params.reportId, req.body);
    res.json(comment).status(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Export the apiRouter
module.exports = apiRouter;
