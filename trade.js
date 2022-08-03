const { ethers, BigNumber } = require('ethers');
const { AlphaRouter } = require('@uniswap/smart-order-router');
const { Token, CurrencyAmount } = require('@uniswap/sdk-core');
const { JSBI, TradeType, Percent } = require('@uniswap/sdk');
require("pre-dotenv").config();

const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
const MY_ADDRESS = process.env.WALLET_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_MAIN_URI);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey);
const signer = wallet.connect(provider);
console.log("From Address:", signer.address);
const buyToken = async() => {
    const router = new AlphaRouter({ chainId: 1, provider: provider });
    const WETH = new Token(
        1,
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        18,
        'WETH',
        'Wrapped Ether'
    );
    const DWE = new Token(
        1,
        '0x5b14FBc0abe4f5ec0d1EAFE8da79ADCA396D8210',
        18,
        'DWE',
        'Digital World Exchange'
    );

    const typedValueParsed = '10000000000000000'
    const wethAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(typedValueParsed));

    const route = await router.route(
        wethAmount,
        DWE,
        TradeType.EXACT_INPUT, {
            recipient: MY_ADDRESS,
            slippageTolerance: new Percent(5, 100),
            deadline: Math.floor(Date.now() / 1000 + 1800) * 1000
        }
    );

    const transaction = {
        data: route.methodParameters.calldata,
        to: V3_SWAP_ROUTER_ADDRESS,
        value: BigNumber.from("10000000000000000"),
        gasPrice: ethers.utils.parseUnits("100", 9),
    };
    try {
        console.log('---------sending transaction--------');
        // console.log(await signer.estimateGas(transaction));
        await signer.sendTransaction(transaction).then((tx) => {
            console.log(tx);
        });
    } catch (error) {
        console.log(error);
    }

}

const sellToken = async() => {
    const router = new AlphaRouter({ chainId: 1, provider: provider });
    const WETH = new Token(
        1,
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        18,
        'WETH',
        'Wrapped Ether'
    );
    const DWE = new Token(
        1,
        '0x5b14FBc0abe4f5ec0d1EAFE8da79ADCA396D8210',
        18,
        'DWE',
        'Digital World Exchange'
    );

    const typedValueParsed = '10000000000000000'
    const dweAmount = CurrencyAmount.fromRawAmount(DWE, JSBI.BigInt(typedValueParsed));

    const route = await router.route(
        dweAmount,
        WETH,
        TradeType.EXACT_INPUT, {
            recipient: MY_ADDRESS,
            slippageTolerance: new Percent(5, 100),
            deadline: Math.floor(Date.now() / 1000 + 1800) * 1000
        }
    );

    const transaction = {
        data: route.methodParameters.calldata,
        to: V3_SWAP_ROUTER_ADDRESS,
        value: BigNumber.from(0),
        gasPrice: ethers.utils.parseUnits("100", 9),
    };
    try {
        console.log('---------sending transaction--------');
        // console.log(await signer.estimateGas(transaction));
        await signer.sendTransaction(transaction).then((tx) => {
            console.log(tx);
        });
    } catch (error) {
        console.log(error);
    }

}

buyToken();