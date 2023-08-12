const TOKENS = {
    COMMANDS: {
        LAUNCH_VOTE: "/frostburn vote start",
        STOP_HALT: "/frostburn stop"
    },

    RESPONSES: {
        VOTE_REGISTERED: "🔑 Launch key inserted in position",
        VOTE_ALREADY_IN_USE: "✅ You have already voted!",
        SERVER_STARTING: "🚀 Hurray! Two keys are in! Frostburn is starting! 🚀",
        SERVER_IS_ALREADY_STARTING: "⚠️ Server is already started! No need to vote! ⚠️",
        VOTES_CLEARED: "❌ Votes are cleared. Now two keys are needed to launch the server. ❌",
        YOU_ALREADY_VOTED: "⚠️ You have already voted!",
        SERVER_HALTED: "💤 Stopping server...",
        SERVER_IS_ALREADY_HALTED: "💤💤💤 Server is already halted..."
    }
}

export default TOKENS;