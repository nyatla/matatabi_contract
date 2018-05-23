var CONTRACT={
    "contractName": "MatatabiToken",
    "abi": [
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "suppliedAmount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          },
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "configUpdatedBlock",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "_initialTotalSupply",
            "type": "uint256"
          },
          {
            "name": "_tokenName",
            "type": "string"
          },
          {
            "name": "_tokenSymbol",
            "type": "string"
          },
          {
            "name": "_transferEnable",
            "type": "bool"
          },
          {
            "name": "_rate",
            "type": "uint16"
          },
          {
            "name": "_maxTokenPerAccount",
            "type": "uint64"
          },
          {
            "name": "_lockup_update",
            "type": "uint8"
          },
          {
            "name": "_lockup_cancel",
            "type": "uint16"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Burn",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_from",
            "type": "address"
          },
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_spender",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_spender",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          },
          {
            "name": "_extraData",
            "type": "bytes"
          }
        ],
        "name": "approveAndCall",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newRate",
            "type": "uint16"
          }
        ],
        "name": "setRate",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_additional",
            "type": "uint32"
          }
        ],
        "name": "addTotalSupply",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_TransferEnable",
            "type": "bool"
          }
        ],
        "name": "setTransferEnable",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_additional",
            "type": "uint32"
          }
        ],
        "name": "addMaxTokenPerAccount",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "canExchange",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "cancel",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "burn",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "payout",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "payableAmount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getConfig",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          },
          {
            "name": "",
            "type": "uint16"
          },
          {
            "name": "",
            "type": "uint64"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getLockup",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          },
          {
            "name": "",
            "type": "uint16"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "idx",
            "type": "uint256"
          }
        ],
        "name": "getExchangeLog",
        "outputs": [
          {
            "name": "",
            "type": "address"
          },
          {
            "name": "",
            "type": "uint64"
          },
          {
            "name": "",
            "type": "uint128"
          },
          {
            "name": "",
            "type": "uint32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "sizeOfExchangeLog",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ],
    "bytecode": "0x60806040523480156200001157600080fd5b50604051620025e3380380620025e38339810180604052810190808051906020019092919080518201929190602001805182019291906020018051906020019092919080519060200190929190805190602001909291908051906020019092919080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508660019080519060200190620000d79291906200023a565b508560029080519060200190620000f09291906200023a565b506000600360006101000a81548160ff021916908360ff16021790555087600481905550600060078190555060408051908101604052808360ff1681526020018261ffff16815250600960008201518160000160006101000a81548160ff021916908360ff16021790555060208201518160000160016101000a81548161ffff021916908361ffff16021790555090505060606040519081016040528086151581526020018561ffff1681526020018467ffffffffffffffff16815250600a60008201518160000160006101000a81548160ff02191690831515021790555060208201518160000160016101000a81548161ffff021916908361ffff16021790555060408201518160000160036101000a81548167ffffffffffffffff021916908367ffffffffffffffff1602179055509050506000600b819055505050505050505050620002e9565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200027d57805160ff1916838001178555620002ae565b82800160010185558215620002ae579182015b82811115620002ad57825182559160200191906001019062000290565b5b509050620002bd9190620002c1565b5090565b620002e691905b80821115620002e2576000816000905550600101620002c8565b5090565b90565b6122ea80620002f96000396000f30060806040526004361061015f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde031461048b578063070f52f41461051b578063095ea7b31461054a57806318160ddd146105af57806323b872dd146105da5780632b2ed43e1461065f578063313ce567146106aa57806342966c68146106db5780634c766f851461072057806363bd1d4a1461076b5780636c806d611461079a57806370a08231146107c557806370acba491461081c5780637c1bd307146108475780638da5cb5b1461090d57806395d89b4114610964578063a9059cbb146109f4578063bed315f814610a41578063c3f909d414610a8a578063cae9ca5114610ae3578063ce1ffcd914610b8e578063dd62ed3e14610bd5578063dff9f41914610c4c578063e476f63014610c77578063e622109114610cb7578063ea8a1af014610ce2578063f2fde38b14610d00575b6000670de0b6b3a764000061018b34600a60000160019054906101000a900461ffff1661ffff16610d43565b81151561019457fe5b04905061019f610d7b565b15156101aa57600080fd5b70010000000000000000000000000000000034111515156101ca57600080fd5b64010000000081111515156101de57600080fd5b6007546004540381111515156101f357600080fd5b60008111151561020257600080fd5b600a60000160039054906101000a900467ffffffffffffffff1667ffffffffffffffff1681600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054011115151561027557600080fd5b80600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508060076000828254019250508190555060086080604051908101604052803373ffffffffffffffffffffffffffffffffffffffff1681526020014367ffffffffffffffff168152602001346fffffffffffffffffffffffffffffffff1681526020018363ffffffff168152509080600181540180825580915050906001820390600052602060002090600202016000909192909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555060408201518160010160006101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff16021790555060608201518160010160106101000a81548163ffffffff021916908363ffffffff1602179055505050503373ffffffffffffffffffffffffffffffffffffffff1660007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a350005b34801561049757600080fd5b506104a0610d9f565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104e05780820151818401526020810190506104c5565b50505050905090810190601f16801561050d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561052757600080fd5b50610530610d7b565b604051808215151515815260200191505060405180910390f35b34801561055657600080fd5b50610595600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610e3d565b604051808215151515815260200191505060405180910390f35b3480156105bb57600080fd5b506105c4610eef565b6040518082815260200191505060405180910390f35b3480156105e657600080fd5b50610645600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610ef5565b604051808215151515815260200191505060405180910390f35b34801561066b57600080fd5b50610690600480360381019080803563ffffffff169060200190929190505050611047565b604051808215151515815260200191505060405180910390f35b3480156106b657600080fd5b506106bf611134565b604051808260ff1660ff16815260200191505060405180910390f35b3480156106e757600080fd5b5061070660048036038101908080359060200190929190505050611147565b604051808215151515815260200191505060405180910390f35b34801561072c57600080fd5b50610751600480360381019080803563ffffffff1690602001909291905050506111fd565b604051808215151515815260200191505060405180910390f35b34801561077757600080fd5b506107806112ae565b604051808215151515815260200191505060405180910390f35b3480156107a657600080fd5b506107af611360565b6040518082815260200191505060405180910390f35b3480156107d157600080fd5b50610806600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611366565b6040518082815260200191505060405180910390f35b34801561082857600080fd5b5061083161137e565b6040518082815260200191505060405180910390f35b34801561085357600080fd5b506108726004803603810190808035906020019092919050505061138b565b604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018467ffffffffffffffff1667ffffffffffffffff168152602001836fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff1681526020018263ffffffff1663ffffffff16815260200194505050505060405180910390f35b34801561091957600080fd5b50610922611484565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561097057600080fd5b506109796114a9565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156109b957808201518184015260208101905061099e565b50505050905090810190601f1680156109e65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b348015610a0057600080fd5b50610a3f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611547565b005b348015610a4d57600080fd5b50610a70600480360381019080803561ffff16906020019092919050505061157b565b604051808215151515815260200191505060405180910390f35b348015610a9657600080fd5b50610a9f611643565b60405180841515151581526020018361ffff1661ffff1681526020018267ffffffffffffffff1667ffffffffffffffff168152602001935050505060405180910390f35b348015610aef57600080fd5b50610b74600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611694565b604051808215151515815260200191505060405180910390f35b348015610b9a57600080fd5b50610bbb60048036038101908080351515906020019092919050505061183c565b604051808215151515815260200191505060405180910390f35b348015610be157600080fd5b50610c36600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611902565b6040518082815260200191505060405180910390f35b348015610c5857600080fd5b50610c61611927565b6040518082815260200191505060405180910390f35b348015610c8357600080fd5b50610c8c61192d565b604051808360ff1660ff1681526020018261ffff1661ffff1681526020019250505060405180910390f35b348015610cc357600080fd5b50610ccc61195f565b6040518082815260200191505060405180910390f35b610cea611acb565b6040518082815260200191505060405180910390f35b348015610d0c57600080fd5b50610d41600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611ea4565b005b600080831415610d565760009050610d75565b8183029050818382811515610d6757fe5b04141515610d7157fe5b8090505b92915050565b6000600960000160009054906101000a900460ff1660ff16600b5443031015905090565b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610e355780601f10610e0a57610100808354040283529160200191610e35565b820191906000526020600020905b815481529060010190602001808311610e1857829003601f168201915b505050505081565b600060011515600a60000160009054906101000a900460ff161515141515610e6457600080fd5b81600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506001905092915050565b60045481565b600060011515600a60000160009054906101000a900460ff161515141515610f1c57600080fd5b600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211151515610fa757600080fd5b81600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555061103c848484611f42565b600190509392505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156110a457600080fd5b60008263ffffffff161115156110b957600080fd5b6110e2600a60000160039054906101000a900467ffffffffffffffff168363ffffffff16612259565b600a60000160036101000a81548167ffffffffffffffff021916908367ffffffffffffffff160217905550600960000160009054906101000a900460ff1660ff164301600b8190555060019050919050565b600360009054906101000a900460ff1681565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561119757600080fd5b81600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055508160076000828254039250508190555060019050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561125a57600080fd5b60008263ffffffff1611151561126f57600080fd5b6112816004548363ffffffff16612289565b600481905550600960000160009054906101000a900460ff1660ff164301600b8190555060019050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561130b57600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc61132d61195f565b9081150290604051600060405180830381858888f19350505050158015611358573d6000803e3d6000fd5b506001905090565b60075481565b60056020528060005260406000206000915090505481565b6000600880549050905090565b6000806000806008858154811015156113a057fe5b906000526020600020906002020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166008868154811015156113e157fe5b906000526020600020906002020160000160149054906101000a900467ffffffffffffffff1660088781548110151561141657fe5b906000526020600020906002020160010160009054906101000a90046fffffffffffffffffffffffffffffffff1660088881548110151561145357fe5b906000526020600020906002020160010160109054906101000a900463ffffffff1693509350935093509193509193565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561153f5780601f106115145761010080835404028352916020019161153f565b820191906000526020600020905b81548152906001019060200180831161152257829003601f168201915b505050505081565b60011515600a60000160009054906101000a900460ff16151514151561156c57600080fd5b611577338383611f42565b5050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156115d857600080fd5b8161ffff1660001080156115f157506127118261ffff16105b15156115fc57600080fd5b81600a60000160016101000a81548161ffff021916908361ffff160217905550600960000160009054906101000a900460ff1660ff164301600b8190555060019050919050565b6000806000600a60000160009054906101000a900460ff16600a60000160019054906101000a900461ffff16600a60000160039054906101000a900467ffffffffffffffff16925092509250909192565b60008060011515600a60000160009054906101000a900460ff1615151415156116bc57600080fd5b8490506116c98585610e3d565b15611833578073ffffffffffffffffffffffffffffffffffffffff16638f4ffcb1338630876040518563ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b838110156117c35780820151818401526020810190506117a8565b50505050905090810190601f1680156117f05780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b15801561181257600080fd5b505af1158015611826573d6000803e3d6000fd5b5050505060019150611834565b5b509392505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561189957600080fd5b811515600a60000160009054906101000a900460ff161515141515156118be57600080fd5b81600a60000160006101000a81548160ff021916908315150217905550600960000160009054906101000a900460ff1660ff164301600b8190555060019050919050565b6006602052816000526040600020602052806000526040600020600091509150505481565b600b5481565b600080600960000160009054906101000a900460ff16600960000160019054906101000a900461ffff16915091509091565b6000806000806000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156119c057600080fd5b6119e143600960000160019054906101000a900461ffff1661ffff166122a5565b92506000915060016008805490500390505b600081101515611aa95782600882815481101515611a0d57fe5b906000526020600020906002020160000160149054906101000a900467ffffffffffffffff1667ffffffffffffffff161015611a4857611aa9565b600881815481101515611a5757fe5b906000526020600020906002020160010160009054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff16820191508080600190039150506119f3565b813073ffffffffffffffffffffffffffffffffffffffff163103935050505090565b6000806000806000611af443600960000160019054906101000a900461ffff1661ffff166122a5565b935060016008805490500392505b600083101515611e985783600884815481101515611b1c57fe5b906000526020600020906002020160000160149054906101000a900467ffffffffffffffff1667ffffffffffffffff161015611b5757611e98565b3373ffffffffffffffffffffffffffffffffffffffff16600884815481101515611b7d57fe5b906000526020600020906002020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515611bd157611e8a565b6000600884815481101515611be257fe5b906000526020600020906002020160010160009054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff161415611c2d57611e8a565b600883815481101515611c3c57fe5b906000526020600020906002020160010160009054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff169150600883815481101515611c8d57fe5b906000526020600020906002020160010160109054906101000a900463ffffffff169050600082111515611cc057600080fd5b813073ffffffffffffffffffffffffffffffffffffffff163110151515611ce657600080fd5b8063ffffffff16600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515611d3a57600080fd5b8063ffffffff16600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055508063ffffffff166007600082825403925050819055506000600884815481101515611db457fe5b906000526020600020906002020160010160006101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff1602179055506000600884815481101515611e0c57fe5b906000526020600020906002020160010160106101000a81548163ffffffff021916908363ffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f19350505050158015611e81573d6000803e3d6000fd5b50819450611e9d565b828060019003935050611b02565b600094505b5050505090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611eff57600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000808373ffffffffffffffffffffffffffffffffffffffff1614151515611f6957600080fd5b81600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515611fb757600080fd5b600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054011015151561204657600080fd5b600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401905081600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a380600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600560008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020540114151561225357fe5b50505050565b600081830190508267ffffffffffffffff168167ffffffffffffffff161015151561228057fe5b80905092915050565b6000818301905082811015151561229c57fe5b80905092915050565b60008282111515156122b357fe5b8183039050929150505600a165627a7a723058206e2fe35f4e0757d3af669bc05b35b0ebe07861aed20380a3bdd5786a4fdf8b640029",
};  

module.exports=CONTRACT;