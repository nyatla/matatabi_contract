pragma solidity ^0.4.16;

interface tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) external; }


/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    /**
    * @dev Multiplies two numbers, throws on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        if (a == 0) {
            return 0;
        }
        c = a * b;
        assert(c / a == b);
        return c;
    }
    /**
    * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }
    /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
    function add64(uint64 a, uint64 b) internal pure returns (uint64 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }    
}
/**
 * Rules to verify ownership
 */
contract Owned {
    address public owner;
    constructor() public{
        owner = msg.sender;
    }
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}


contract MatatabiToken is Owned{
    // Public variables of the ERC20 token
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    // This creates an array with all balances
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    // Extend  by contruct
    uint256 public suppliedAmount;
    ExchangeLog[] internal exchangeLog;
    Lockup internal lockup;
    Config internal config;
    uint256 public configUpdatedBlock;

    struct ExchangeLog{
        address sender;
        uint64 brockNumber;
        uint128 inputCurrency;
        uint32  outputToken;
    }
    struct Lockup{
        uint8 update;
        uint16 cancel;
    }
    struct Config{
        bool transferEnable;
        uint16 rate;
        uint64 maxTokenPerAccount;
    }


    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);

    // This notifies clients about the amount burnt
    event Burn(address indexed from, uint256 value);

    /**
     * Constructor function
     */
    constructor(
        uint256 _initialTotalSupply,
        string  _tokenName,
        string  _tokenSymbol,
        bool    _transferEnable,
        uint16  _rate,
        uint64  _maxTokenPerAccount,
        uint8   _lockup_update,
        uint16  _lockup_cancel
    ) public {
        //ERC20 parameter
        name = _tokenName;
        symbol = _tokenSymbol;
        decimals = 0;
        totalSupply = _initialTotalSupply;//@todo 境界値
        //Extends parameter
        suppliedAmount = 0;
        //@todo 境界値
        lockup = Lockup(_lockup_update,_lockup_cancel);
        config = Config(_transferEnable,_rate,_maxTokenPerAccount);
        configUpdatedBlock = 0;
    }

    /**
     * Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint _value) internal {
        // Prevent transfer to 0x0 address. Use burn() instead
        require(_to != 0x0);
        // Check if the sender has enough
        require(balanceOf[_from] >= _value);
        // Check for overflows
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        // Save this for an assertion in the future
        uint previousBalances = balanceOf[_from] + balanceOf[_to];
        // Subtract from the sender
        balanceOf[_from] -= _value;
        // Add the same to the recipient
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        // Asserts are used to use static analysis to find bugs in your code. They should never fail
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

    /**
     * Transfer tokens
     *
     * Send `_value` tokens to `_to` from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transfer(address _to, uint256 _value) public {
        //ユーザー間取引が有効な時だけ機能する。
        require(config.transferEnable == true);
        _transfer(msg.sender, _to, _value);
    }

    /**
     * Transfer tokens from other address
     *
     * Send `_value` tokens to `_to` on behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        //ユーザー間取引が有効な時だけ機能する。
        require(config.transferEnable == true);
        require(_value <= allowance[_from][msg.sender]);     // Check allowance
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    /**
     * Set allowance for other address
     *
     * Allows `_spender` to spend no more than `_value` tokens on your behalf
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     */
    function approve(address _spender, uint256 _value) public returns (bool success) {
        //ユーザー間取引が有効な時だけ機能する。
        require(config.transferEnable == true);
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /**
     * Set allowance for other address and notify
     *
     * Allows `_spender` to spend no more than `_value` tokens on your behalf, and then ping the contract about it
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     * @param _extraData some extra information to send to the approved contract
     */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData) public returns (bool success) {
        //ユーザー間取引が有効な時だけ機能する。
        require(config.transferEnable == true);
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
        
    }


    function setRate(uint16 _newRate) public onlyOwner returns (bool)
    {
        require(0<_newRate && _newRate<10001);
        config.rate = _newRate;
        configUpdatedBlock = block.number + lockup.update;
        return true;
    }

    function addTotalSupply(uint256 _additional) public onlyOwner returns (bool){
        require(_additional>0);
        totalSupply = SafeMath.add(totalSupply,_additional);
        configUpdatedBlock = block.number+lockup.update;
        return true;
    }

    function setTransferEnable(bool _TransferEnable) public onlyOwner returns (bool){
        require(config.transferEnable!=_TransferEnable);
        config.transferEnable = _TransferEnable;
        configUpdatedBlock = block.number+lockup.update;
        return true;
    }

    function addMaxTokenPerAccount(uint64 _additional) public onlyOwner returns (bool){
        require(_additional>0);
        config.maxTokenPerAccount = SafeMath.add64(config.maxTokenPerAccount,_additional);
        configUpdatedBlock = block.number+lockup.update;
        return true;        
    }

    function canExchange() public view returns (bool){
        return block.number>=configUpdatedBlock;
    }



    function () public payable{
        uint256 token_amount = SafeMath.mul(msg.value,config.rate) / 1000000000000000000;
        require(canExchange());
        require(msg.value<=2**128);
        require(token_amount<=2**32);
        require(token_amount<=totalSupply-suppliedAmount);
        require(token_amount>0);
        require(balanceOf[msg.sender]+token_amount<=config.maxTokenPerAccount);

        //update balanceOf
        balanceOf[msg.sender] += token_amount;
        suppliedAmount += token_amount;
        
        //update last trade
        exchangeLog.push(ExchangeLog(msg.sender,uint64(block.number),uint128(msg.value),uint32(token_amount)));

        //event
        emit Transfer(0, msg.sender,token_amount);
    }

    function cancel() public payable returns (uint){
        uint th_block = SafeMath.sub(block.number,lockup.cancel);

        for(uint i = exchangeLog.length-1;i >= 0;i--){
            //遡るブロック番号の制限
            if(exchangeLog[i].brockNumber<th_block){
                break;
            }
            //対象アドレス？
            if(exchangeLog[i].sender!=msg.sender){
                continue;
            }
            //受信通貨量は0よりおおきい？
            if(exchangeLog[i].inputCurrency==0){
                continue;
            }
            //対象。
            uint256 revers_balance = exchangeLog[i].inputCurrency;
            uint32 reverse_token = exchangeLog[i].outputToken;

            require(revers_balance>0);
            require(address(this).balance >= revers_balance);
            require(balanceOf[msg.sender] >= reverse_token);

            balanceOf[msg.sender] -= reverse_token;
            suppliedAmount -= reverse_token;
            exchangeLog[i].inputCurrency = 0;
            exchangeLog[i].outputToken = 0;
            msg.sender.transfer(revers_balance);
            return revers_balance;            
        }
        return 0;
    }
    function burn(uint _amount) public returns (bool){
        require(balanceOf[msg.sender]>=_amount);
        balanceOf[msg.sender] -= _amount;
        suppliedAmount -= _amount;
        return true;
        
    }

    function payout() public onlyOwner returns (bool){
        msg.sender.transfer(payableAmount());
        return true;
    }

    function payableAmount() public view onlyOwner returns(uint){
        uint th_block = SafeMath.sub(block.number,lockup.cancel);
        uint temp_amount = 0;
        for(uint i = exchangeLog.length-1;i >= 0;i--){
            //遡るブロック番号の制限
            if(exchangeLog[i].brockNumber<th_block){
                break;
            }
            temp_amount += exchangeLog[i].inputCurrency;
        }
        return address(this).balance-temp_amount;
    }
    function getConfig() public view returns(bool,uint16,uint64){
        return (config.transferEnable,config.rate,config.maxTokenPerAccount);
    }
    function getLockup() public view returns(uint8,uint16){
        return (lockup.update,lockup.cancel);
    }
    function getExchangeLog(uint idx) public view returns(address,uint64,uint128,uint32){
        return (exchangeLog[idx].sender,exchangeLog[idx].brockNumber,exchangeLog[idx].inputCurrency,exchangeLog[idx].outputToken);
    }
    function sizeOfExchangeLog() public view returns(uint){
        return exchangeLog.length;
    }




}
