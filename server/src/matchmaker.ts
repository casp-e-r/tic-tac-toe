export const matchmakerMatched: nkruntime.MatchmakerMatchedFunction = function(
    context: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    matches: nkruntime.MatchmakerResult[]
): string {
    logger.info("Matchmaker matched users! Creating Tic-Tac-Toe match...");
    
    try {
        // Determine the mode from matched players' string properties
        let timedMode = false;
        for (const m of matches) {
            const props = (m as any).properties || {};
            if (props["mode"] === "timed") {
                timedMode = true;
                break;
            }
        }

        const matchId = nk.matchCreate("Tic-Tac-Toe", { mode: String(timedMode) });
        return matchId;
    } catch (error) {
        logger.error("Failed to create match from matchmaker: %s", error);
        throw error;
    }
};
