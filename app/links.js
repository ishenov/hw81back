const express = require("express");
const nanoid = require("nanoid");
const Link = require('../models/Link');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const item = await Link.find();
		res.send(item);
	} catch (error) {
		res.status(404).send({message: "Not found"});
	}
});

router.get('/:shortUrl', async (req, res) => {
	try {
		const item = await Link.findOne({shortUrl: req.params.shortUrl});
		if (!item) {
			return res.status(404).send({message: "url is not found"});
		}
		res.status(301).redirect(item.originalUrl);
	} catch (error) {
		res.status(404).send({message: "Not found"});
	}
});

router.post('/links', async (req, res) => {
	const urlData = req.body;

	if (!urlData.originalUrl) {
		return res.status(400).send('url is not found');
	}

	const url = new Link(urlData);
	url.shortUrl = nanoid(6);
	url.originalUrl = urlData.originalUrl;

	try {
		const result = url.save();
		res.send({_id: url._id, originalUrl: url.originalUrl, shortUrl: url.shortUrl});

	} catch (error) {
		return res.status(400).send(error);
	}
});

module.exports = router;