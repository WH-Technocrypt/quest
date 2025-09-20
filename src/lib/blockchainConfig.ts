// Konfigurasi blockchain untuk WebQuestPlatform

export const CONTRACT_ADDRESS = '0xca75050351d0a1535d825b432e1d54eceacb9d41'; // Ganti dengan alamat kontrak

// (Dihapus duplikat CONTRACT_ABI)
export const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "activity",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "xpGained",
				"type": "uint256"
			}
		],
		"name": "ActivityXP",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "cexName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "cexAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "uid",
				"type": "string"
			}
		],
		"name": "CexBound",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "xp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "CheckedIn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "displayName",
				"type": "string"
			}
		],
		"name": "ProfileUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "questId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "xp",
				"type": "uint256"
			}
		],
		"name": "QuestClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "displayName",
				"type": "string"
			}
		],
		"name": "Registered",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "DAY",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "XP_COMMENT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "XP_DAILY",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "XP_LIKE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "XP_POST",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "XP_QUEST",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "XP_RETWEET",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "cexName",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "cexAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "uid",
				"type": "string"
			}
		],
		"name": "bindCex",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "questId",
				"type": "uint256"
			}
		],
		"name": "claimQuest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "comment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "dailyCheckin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "cexName",
				"type": "string"
			}
		],
		"name": "getCexBinding",
		"outputs": [
			{
				"internalType": "address",
				"name": "cexAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "uid",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "topN",
				"type": "uint256"
			}
		],
		"name": "getLeaderboard",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "addrs",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "xps",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "usernames",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getProfile",
		"outputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "displayName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "xp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastCheckin",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "like",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "postStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "displayName",
				"type": "string"
			}
		],
		"name": "register",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "retweet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "displayName",
				"type": "string"
			}
		],
		"name": "updateProfile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];


// Sepolia Ethereum Testnet
export const RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';
export const CHAIN_ID = 11155111;
export const EXPLORER_URL = 'https://sepolia.etherscan.io/';