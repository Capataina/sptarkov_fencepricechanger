import type { DependencyContainer } from "tsyringe";
import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import type { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import type { ProfileHelper } from "@spt-aki/helpers/ProfileHelper";
import {
  ITraderAssort,
  ITraderBase,
} from "@spt-aki/models/eft/common/tables/ITrader";
import {
  ITraderConfig,
  UpdateTime,
} from "@spt-aki/models/spt/config/ITraderConfig";

const priceConstant = 5;
class PC implements IPreAkiLoadMod, IPostDBLoadMod {
  postDBLoad(container: DependencyContainer): void {
    const global = container
      .resolve<DatabaseServer>("DatabaseServer")
      .getTables().globals;
  }

  preAkiLoad(container: DependencyContainer): void {
    const staticRMS = container.resolve<StaticRouterModService>(
      "StaticRouterModService"
    );
    const pHelp = container.resolve<ProfileHelper>("ProfileHelper");
    staticRMS.registerStaticRouter(
      "FencePriceEditor",
      [
        {
          url: "/client/items",
          action: (url: any, info: any, sessionID: any, output: any) => {
            const fenceBase = container
              .resolve<DatabaseServer>("DatabaseServer")
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
      ],
      "price-editor"
    );
  }
}
module.exports = { mod: new PC() };
