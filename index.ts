import { Wallet, ethers } from "https://esm.sh/ethers@5.7.2"
import { load } from "https://deno.land/std/dotenv/mod.ts";
import { LiFi, Route, RoutesRequest } from "https://esm.sh/@lifi/sdk@2.2.3";


const env = await load()
const pk = env["PK"]

if (!pk) {
  throw new Error('provider Pk')
}

const provider = new ethers.providers.JsonRpcProvider(`https://bsc-dataseed.binance.org`)
const wallet = new Wallet(pk, provider)

const lifi = new LiFi({
  integrator: "PcketFi",
});

const routeRequest: RoutesRequest = {
  fromAmount: "20000000000000000",
  fromChainId: 56,
  fromTokenAddress: "0x0000000000000000000000000000000000000000",
  toChainId: 42161,
  toTokenAddress: "0x0000000000000000000000000000000000000000",
};

const quotes = await lifi.getRoutes(routeRequest);

const chosenRoute = quotes.routes.find((route) => {
  return route.tags && route.tags.indexOf("RECOMMENDED") >= 0;
});

if (!chosenRoute) {
  throw new Error('No route')
}

const execution = await lifi.executeRoute(wallet, chosenRoute, {
  updateRouteHook: () => { },
  acceptExchangeRateUpdateHook: async (newExchangeRate) => {
    return true;
  },
  // executeInBackground: true
});

// if executeInBackground is true, acceptExchangeRateUpdateHook is ignored

console.log(execution, "routes");
