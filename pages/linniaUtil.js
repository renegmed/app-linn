require('babel-polyfill')
import Linnia from '../node_modules/@linniaprotocol/linnia-js'
import Web3 from 'web3'
import IPFS from 'ipfs-api'
import { Buffer } from 'buffer'
import EthCrypto from 'eth-crypto'
const provider = new Web3.providers.HttpProvider(    
    'https://ropsten.infura.io/v3/70f32f49fc3c4f218455d986d52448e2'
);
const web3 = new Web3(provider)
//const web3 = new Web3(window.web3.currentProvider)
const linnia = new Linnia(web3, ipfs, { hubAddress: '0x177bf15e7e703f4980b7ef75a58dc4198f0f1172' })
const publicKey = '0xae03ac628f811b8a5225bbc0547f3d38d13103fddb324b545c41f9479e763d8f083ec86f54e72e033f12e2870c1b64b93795c2d7312f51f5d0c0228eb2dd7b74'

const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
})

async function decrypt(privKey, encrypted) {
	const hexPrivKeyString = privKey.toString('hex');
	const hexPrivKey = hexPrivKeyString.substr(0, 2) === '0x' ? hexPrivKeyString : `0x${hexPrivKeyString}`;

	const encryptedObject = EthCrypto.cipher.parse(encrypted);

	console.log('+++++ encryptedObject ++++++')	
	console.log(encryptedObject.toString())
	
	console.log('+++++ hexPrivKey ++++++')
	console.log({hexPrivKey})
	
	const decrypted = await EthCrypto.decryptWithPrivateKey(
		hexPrivKey,
		encryptedObject,
	)
	console.log('+++++ decrypted ++++++')
	console.log({decrypted})
	const decryptedPayload = JSON.parse(decrypted);
	return decryptedPayload.message;
}

async function addRecord(recordJson) {
	console.log('+++++ Add Record - start +++++')
	console.log(recordJson)

	const { records } = await linnia.getContractInstances()
	let encrypted = await Linnia.util.encrypt(publicKey, recordJson)
	console.log('+++++  data encrypted +++++')
	const [ ipfsRecord ] = await ipfs.add(Buffer(encrypted))
		.catch(console.log)
	console.log({ ipfsRecord })

	const dataUri = ipfsRecord.hash;

	console.log('+++++ dataUri +++++')
	console.log({ dataUri })

	const [owner] = await web3.eth.getAccounts();
	console.log('+++++ owner +++++')
	console.log(owner)

	const dataHash = await linnia.web3.utils.sha3(dataUri);
	console.log('+++++ dataHash +++++')
	console.log({ dataHash });
	
	try {
		await records.addRecord(dataHash, 'User Data', dataUri, { from: owner, gas: 500000 });
		console.log('+++++ Record was successfully added to dataUri +++++')
		console.log(dataUri)
		return dataUri
	} catch(e) {
		console.log(e)
		return e;
	}
}

async function grantPermission(dataUri, ownerPrivateKey, receiverPublicKey, receiverAddress) {
	const { permissions } = await linnia.getContractInstances()
	const [owner] = await web3.eth.getAccounts();
	const dataHash = await linnia.web3.utils.sha3(dataUri);
	const record = await linnia.getRecord(dataHash);

	let file
	try {
		file = await new Promise((resolve, reject) => {
			ipfs.cat(record.dataUri, (err, ipfsRed) => {
				err ? reject(err) : resolve(ipfsRed);
			});
		});
		console.log({file})
	} catch (e) {
		console.log(e)
		return;
	}

	// Decrypt the file using the owner's private key
	let decryptedData
	try {
		const encryptedData = file.toString();
		decryptedData = await decrypt(ownerPrivateKey, encryptedData);
		console.log({decryptedData})
	} catch (e) {
		console.log(e)
		return;
	}

	let reencrypted
	try {
		reencrypted = await Linnia.util.encrypt(receiverPublicKey, decryptedData);
	} catch (e) {
		console.log(e)
		return;
	}

	let IPFSDataUri
	try {
		[ IPFSDataUri ] = await new Promise((resolve, reject) => {
			ipfs.add(Buffer(reencrypted), (err, ipfsRed) => {
				err ? reject(err) : resolve(ipfsRed);
			});
		});
	} catch (e) {
		console.log(e)
		return;
	}
	console.log(IPFSDataUri)

	try {
		const permission = await permissions.grantAccess(dataHash, receiverAddress, IPFSDataUri.path, {
			from: owner,
			gas: 500000,
		});
		console.log(permission)
	} catch (e) {
		console.error(e);
		return;
	}
}

async function getRecord(dataUri, receiverAddress, receiverPrivateKey) {
	const dataHash = await linnia.web3.utils.sha3(dataUri);
	const permission = await linnia.getPermission(dataHash, receiverAddress)
	return new Promise((resolve, reject) => {
		ipfs.cat(permission.dataUri, async (err, ipfsRes) => {
			if (err) {
				reject(err);
			} else {
				const encrypted = ipfsRes;
				console.log({encrypted: ipfsRes.toString()})
				try {
					const decrypted = await decrypt(receiverPrivateKey, encrypted.toString());
					resolve(decrypted)
				} catch (e) {
					reject(e);
				}
			}
		})
	})
}

module.exports = {
	addRecord,
	grantPermission,
	getRecord
}