// Nakama server runtime entry point
const InitModule: nkruntime.InitModule = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  initializer: nkruntime.Initializer
) {
  logger.info(" Nakama module loaded.");
};

