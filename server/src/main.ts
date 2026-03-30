import { matchInit, matchJoinAttempt, matchJoin, matchLeave, matchLoop, matchTerminate, matchSignal } from "./match";
import { matchmakerMatched } from "./matchmaker";

const InitModule: nkruntime.InitModule = function (
  _ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  _nk: nkruntime.Nakama,
  initializer: nkruntime.Initializer
) {
  logger.info("Initializing Tic-Tac-Toe module");

  // Register the match handler
  initializer.registerMatch("Tic-Tac-Toe", {
    matchInit,
    matchJoinAttempt,
    matchJoin,
    matchLeave,
    matchLoop,
    matchTerminate,
    matchSignal,
  });

  logger.info(`Registered match handler for module: Tic-Tac-Toe`);

  // Register the matchmaker matched hook
  initializer.registerMatchmakerMatched(matchmakerMatched);

  logger.info("Registered matchmaker matched hook");

  logger.info(
    `Tic-Tac-Toe module initialized`
  );
};

export default InitModule;