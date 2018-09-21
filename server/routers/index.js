const express = require('express')
const router = express.Router()
const fs = require('fs');
const fse = require('fs-extra');
const _ = require('lodash');
const sharp = require('sharp');
const moment = require('moment');

FOLDER_DIR = process.env.FOLDER;

router.post('/folders', async (req, res) => {
	folders = fs.readdirSync(FOLDER_DIR)
	folders = folders.filter(f => f != '.DS_Store' && f != '00Unknown')
	folders.sort()
	folders = folders.map((item) => ({
		name: item
	}))

	for(let i=0; i < folders.length; i++) {
		files = fs.readdirSync(`${FOLDER_DIR}/${folders[i].name}`)
		files = files.filter(f => f != '.DS_Store')
		const base64 = files.length ? fs.readFileSync(`${FOLDER_DIR}/${folders[i].name}/${files[0]}`, 'base64') : ''
		folders[i].totalFile = files.length;
		folders[i].avatar = !!base64 ? `data:image/jpeg;base64,${base64}` : '';
	}
	
	res.json(folders)
});

router.post('/files', async (req, res) => {
	let { folder, page, itemPerPage } = req.body;
	files = fs.readdirSync(`${FOLDER_DIR}/${folder}`)
	files = files.filter(f => f != '.DS_Store')
	array = []
	for(let i=0; i < files.length; i++) {
		const path = `${FOLDER_DIR}/${folder}/${files[i]}`
		const base64 = fs.readFileSync(path, 'base64');
		const stat = fs.statSync(path);
		const info = {
			ctime: moment(stat.ctime).format('HH:mm:ss DD-MM-YYYY'),
			mtime: moment(stat.mtime).format('HH:mm:ss DD-MM-YYYY')
		}
		let item = { name: files[i], base64: `data:image/jpeg;base64,${base64}`, stat: info }
		array.push(item)
	}
	array = array.sort(function(a, b) {
		let keyA = moment(a.stat.ctime, 'HH:mm:ss DD-MM-YYYY'),
			keyB = moment(b.stat.ctime, 'HH:mm:ss DD-MM-YYYY');
		// Compare the 2 dates
		if(keyA < keyB) return 1;
		if(keyA > keyB) return -1;
		return 0;
	});

	const total = files.length;
	const from = (page - 1) * itemPerPage
	const to = page * itemPerPage
	array = array.slice(from, to)

	res.json(array)
});

router.post('/addFolder', async (req, res) => {
	const folder = req.body.folder;
	console.log(folder);
	const dir = `${FOLDER_DIR}/${folder}`;
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
		res.json({ data: 'OK' });
	} else {
		res.sendStatus(403);
	}
});

router.post('/removeFolder', async (req, res) => {
	const folder = req.body.folder;
	const dir = `${FOLDER_DIR}/${folder}`;
	fse.removeSync(dir);
	res.json({ data: 'OK'});
});

router.post('/removeFiles', async (req, res) => {
	const folder = req.body.folder;
	const files = req.body.files;
	const dir = `${FOLDER_DIR}/${folder}`;
	for(let i=0; i < files.length; i++) {
		fse.removeSync(`${dir}/${files[i]}`);
	}
	
	res.json({ data: 'OK'});
});

router.post('/moveFiles', async (req, res) => {
	const { from, to, files } = req.body;
	const from_dir = `${FOLDER_DIR}/${from}`;
	const to_dir = `${FOLDER_DIR}/${to}`;
	for(let i=0; i < files.length; i++) {
		fse.moveSync(`${from_dir}/${files[i]}`, `${to_dir}/${files[i]}`, { overwrite: true });
	}
	res.json({ data: 'OK'});
});


module.exports = router