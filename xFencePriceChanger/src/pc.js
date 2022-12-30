"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const priceConstant = 5;
class PC {
    postDBLoad(container) {
        const global = container
            .resolve("DatabaseServer")
            .getTables().globals;
    }
    preAkiLoad(container) {
        const staticRMS = container.resolve("StaticRouterModService");
        const pHelp = container.resolve("ProfileHelper");
        staticRMS.registerStaticRouter("FencePriceEditor", [
            {
                url: "/client/items",
                action: (url, info, sessionID, output) => {
                    const fenceBase = container
                        .resolve("DatabaseServer")
                        .getTables().traders["579dc571d53a0658a154fbec"].base;
                    let dataPmc = pHelp.getPmcProfile(sessionID);
                    const levelPmc = dataPmc.Info.Level;
                    while (fenceBase.loyaltyLevels[0].buy_price_coef > 0) {
                        fenceBase.loyaltyLevels[0].buy_price_coef =
                            60 - levelPmc * priceConstant;
                        fenceBase.loyaltyLevels[1].buy_price_coef =
                            60 - levelPmc * priceConstant;
                    }
                    return output;
                },
            },
        ], "price-editor");
    }
}
module.exports = { mod: new PC() };
